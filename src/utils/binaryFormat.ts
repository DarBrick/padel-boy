import type { StoredTournament, StoredMatch } from '../schemas/tournament'

/**
 * Binary Tournament Data Encoder/Decoder v1
 * 
 * Implements the binary format specification for compact tournament storage.
 * See docs/binary-format-v1.md for complete format documentation.
 */

const VERSION = 0x01
const TEXT_ENCODER = new TextEncoder()
const TEXT_DECODER = new TextDecoder()

/**
 * Encodes tournament data into compact binary format
 */
export function encodeTournament(tournament: StoredTournament): Uint8Array {
  const buffers: Uint8Array[] = []
  
  // 1. Header (4 bytes)
  buffers.push(encodeHeader(tournament))
  
  // 2. Tournament ID (9 bytes ASCII)
  buffers.push(TEXT_ENCODER.encode(tournament.id))
  
  // 3. Tournament name (conditional)
  if (tournament.name) {
    buffers.push(encodeString(tournament.name, 40))
  }
  
  // 4. Custom court names (conditional)
  if (tournament.courtNames && Object.keys(tournament.courtNames).length > 0) {
    buffers.push(encodeCourtNames(tournament.courtNames, tournament.numberOfCourts))
  }
  
  // 5. Players array (bit-packed)
  buffers.push(encodePlayers(tournament.players))
  
  // 6. Matches array
  buffers.push(encodeMatches(tournament.matches))
  
  return concatenateBuffers(buffers)
}

/**
 * Decodes binary data into tournament object
 */
export function decodeTournament(data: Uint8Array): StoredTournament {
  let offset = 0
  
  // 1. Header
  const header = decodeHeader(data.slice(0, 4))
  offset += 4
  
  // 2. Tournament ID
  const id = TEXT_DECODER.decode(data.slice(offset, offset + 9))
  offset += 9
  
  // 3. Tournament name (conditional)
  let name: string | undefined
  if (header.hasCustomName) {
    const result = decodeString(data, offset, 40)
    name = result.value
    offset = result.nextOffset
  }
  
  // 4. Court names (conditional)
  let courtNames: Record<number, string> | undefined
  if (header.hasCustomCourtNames) {
    const result = decodeCourtNames(data, offset, header.numberOfCourts)
    courtNames = result.value
    offset = result.nextOffset
  }
  
  // 5. Players array
  const playersResult = decodePlayers(data, offset, header.playerCount)
  offset = playersResult.nextOffset
  
  // 6. Matches array
  const matchesResult = decodeMatches(data, offset)
  
  return {
    version: VERSION,
    format: header.format,
    pointsPerGame: header.pointsPerGame,
    numberOfCourts: header.numberOfCourts,
    isFixedPairs: header.isFixedPairs,
    playerCount: header.playerCount,
    mexicanoMatchupStyle: header.mexicanoMatchupStyle,
    mexicanoRandomRounds: header.mexicanoRandomRounds,
    id,
    name,
    courtNames,
    players: playersResult.value,
    matches: matchesResult.value,
  }
}

// ============================================================================
// Header Encoding/Decoding
// ============================================================================

interface HeaderData {
  format: 'americano' | 'mexicano'
  pointsPerGame: 16 | 21 | 24 | 32
  numberOfCourts: number
  isFixedPairs: boolean
  mexicanoMatchupStyle?: '1&4vs2&3' | '1&3vs2&4'
  mexicanoRandomRounds?: number
  playerCount: number
  hasCustomName: boolean
  hasCustomCourtNames: boolean
}

function encodeHeader(tournament: StoredTournament): Uint8Array {
  const header = new Uint8Array(4) // Changed to 4 bytes: version + 3 bytes metadata
  
  // Byte 0: Version
  header[0] = VERSION
  
  // Bytes 1-3: Packed metadata (24 bits)
  let metadata = 0
  
  // Bit 0: format
  metadata |= (tournament.format === 'mexicano' ? 1 : 0) << 0
  
  // Bit 1-2: pointsPerGame
  const pointsMap: Record<number, number> = { 16: 0, 21: 1, 24: 2, 32: 3 }
  metadata |= pointsMap[tournament.pointsPerGame] << 1
  
  // Bit 3-6: numberOfCourts
  metadata |= (tournament.numberOfCourts & 0xF) << 3
  
  // Bit 7: isFixedPairs
  metadata |= (tournament.isFixedPairs ? 1 : 0) << 7
  
  // Bit 8: mexicanoMatchupStyle
  if (tournament.mexicanoMatchupStyle) {
    metadata |= (tournament.mexicanoMatchupStyle === '1&3vs2&4' ? 1 : 0) << 8
  }
  
  // Bit 9-11: mexicanoRandomRounds
  if (tournament.mexicanoRandomRounds) {
    metadata |= (tournament.mexicanoRandomRounds & 0x7) << 9
  }
  
  // Bit 12-17: playerCount
  metadata |= (tournament.playerCount & 0x3F) << 12
  
  // Bit 18: hasCustomName
  metadata |= (tournament.name ? 1 : 0) << 18
  
  // Bit 19: hasCustomCourtNames
  const hasCourtNames = tournament.courtNames && Object.keys(tournament.courtNames).length > 0
  metadata |= (hasCourtNames ? 1 : 0) << 19
  
  // Write as little-endian 24-bit (3 bytes)
  header[1] = metadata & 0xFF
  header[2] = (metadata >> 8) & 0xFF
  header[3] = (metadata >> 16) & 0xFF
  
  return header
}

function decodeHeader(data: Uint8Array): HeaderData {
  if (data[0] !== VERSION) {
    throw new Error(`Unsupported format version: ${data[0]}`)
  }
  
  // Read 24-bit metadata (3 bytes)
  const metadata = data[1] | (data[2] << 8) | (data[3] << 16)
  
  // Extract bits
  const format = (metadata & (1 << 0)) ? 'mexicano' : 'americano'
  
  const pointsArray = [16, 21, 24, 32] as const
  const pointsPerGame = pointsArray[(metadata >> 1) & 0x3]
  
  const numberOfCourts = (metadata >> 3) & 0xF
  const isFixedPairs = Boolean((metadata >> 7) & 1)
  const playerCount = (metadata >> 12) & 0x3F
  const hasCustomName = Boolean((metadata >> 18) & 1)
  const hasCustomCourtNames = Boolean((metadata >> 19) & 1)
  
  let mexicanoMatchupStyle: '1&4vs2&3' | '1&3vs2&4' | undefined
  let mexicanoRandomRounds: number | undefined
  
  if (format === 'mexicano') {
    mexicanoMatchupStyle = ((metadata >> 8) & 1) ? '1&3vs2&4' : '1&4vs2&3'
    mexicanoRandomRounds = (metadata >> 9) & 0x7
  }
  
  return {
    format,
    pointsPerGame,
    numberOfCourts,
    isFixedPairs,
    mexicanoMatchupStyle,
    mexicanoRandomRounds,
    playerCount,
    hasCustomName,
    hasCustomCourtNames,
  }
}

// ============================================================================
// String Encoding/Decoding
// ============================================================================

function encodeString(str: string, maxLength: number): Uint8Array {
  if (str.length > maxLength) {
    throw new Error(`String exceeds max length ${maxLength}: ${str.length}`)
  }
  
  const encoded = TEXT_ENCODER.encode(str)
  const buffer = new Uint8Array(1 + encoded.length)
  buffer[0] = encoded.length
  buffer.set(encoded, 1)
  return buffer
}

function decodeString(data: Uint8Array, offset: number, maxLength: number): { value: string; nextOffset: number } {
  const length = data[offset]
  if (length > maxLength) {
    throw new Error(`String length ${length} exceeds max ${maxLength}`)
  }
  
  const str = TEXT_DECODER.decode(data.slice(offset + 1, offset + 1 + length))
  return { value: str, nextOffset: offset + 1 + length }
}

// ============================================================================
// Court Names Encoding/Decoding
// ============================================================================

function encodeCourtNames(courtNames: Record<number, string>, numberOfCourts: number): Uint8Array {
  const buffers: Uint8Array[] = []
  
  // Create bitmask (10 bits in 2 bytes)
  let bitmask = 0
  for (let i = 0; i < numberOfCourts; i++) {
    if (courtNames[i]) {
      bitmask |= (1 << i)
    }
  }
  
  const bitmaskBytes = new Uint8Array(2)
  bitmaskBytes[0] = bitmask & 0xFF
  bitmaskBytes[1] = (bitmask >> 8) & 0xFF
  buffers.push(bitmaskBytes)
  
  // Encode each custom name in order
  for (let i = 0; i < numberOfCourts; i++) {
    if (courtNames[i]) {
      buffers.push(encodeString(courtNames[i], 16))
    }
  }
  
  return concatenateBuffers(buffers)
}

function decodeCourtNames(data: Uint8Array, offset: number, numberOfCourts: number): { value: Record<number, string>; nextOffset: number } {
  // Read bitmask
  const bitmask = data[offset] | (data[offset + 1] << 8)
  offset += 2
  
  const courtNames: Record<number, string> = {}
  
  for (let i = 0; i < numberOfCourts; i++) {
    if (bitmask & (1 << i)) {
      const result = decodeString(data, offset, 16)
      courtNames[i] = result.value
      offset = result.nextOffset
    }
  }
  
  return { value: courtNames, nextOffset: offset }
}

// ============================================================================
// Players Encoding/Decoding (Bit-Packed)
// ============================================================================

function encodePlayers(players: Array<{ name: string }>): Uint8Array {
  // Calculate total size needed
  const totalBits = players.reduce((sum, p) => {
    const nameBytes = TEXT_ENCODER.encode(p.name)
    return sum + 5 + (nameBytes.length * 8) // 5 bits for length + name bytes
  }, 0)
  
  const totalBytes = Math.ceil(totalBits / 8)
  const prefixSize = totalBytes < 128 ? 1 : 2
  const buffer = new Uint8Array(totalBytes + prefixSize)
  
  // Write length prefix (varint)
  let dataStart: number
  if (totalBytes < 128) {
    buffer[0] = totalBytes
    dataStart = 1
  } else {
    buffer[0] = (totalBytes & 0x7F) | 0x80
    buffer[1] = (totalBytes >> 7) & 0xFF
    dataStart = 2
  }
  
  let offset = dataStart
  let bitOffset = 0
  
  for (const player of players) {
    const nameBytes = TEXT_ENCODER.encode(player.name)
    
    // Write 5-bit length
    writeBits(buffer, offset, bitOffset, nameBytes.length, 5)
    bitOffset += 5
    offset += Math.floor(bitOffset / 8)
    bitOffset %= 8
    
    // Write name bytes
    for (const byte of nameBytes) {
      writeBits(buffer, offset, bitOffset, byte, 8)
      bitOffset += 8
      offset += Math.floor(bitOffset / 8)
      bitOffset %= 8
    }
  }
  
  return buffer.slice(0, dataStart + totalBytes)
}

function decodePlayers(data: Uint8Array, offset: number, playerCount: number): { value: Array<{ name: string }>; nextOffset: number } {
  // Read length prefix
  const lengthByte = data[offset]
  let totalBytes: number
  let dataOffset: number
  
  if (lengthByte & 0x80) {
    totalBytes = (lengthByte & 0x7F) | (data[offset + 1] << 7)
    dataOffset = offset + 2
  } else {
    totalBytes = lengthByte
    dataOffset = offset + 1
  }
  
  const players: Array<{ name: string }> = []
  let bitOffset = 0
  let byteOffset = 0
  
  for (let i = 0; i < playerCount; i++) {
    // Read 5-bit length
    const nameLength = readBits(data, dataOffset + byteOffset, bitOffset, 5)
    bitOffset += 5
    byteOffset += Math.floor(bitOffset / 8)
    bitOffset %= 8
    
    // Read name bytes
    const nameBytes = new Uint8Array(nameLength)
    for (let j = 0; j < nameLength; j++) {
      nameBytes[j] = readBits(data, dataOffset + byteOffset, bitOffset, 8)
      bitOffset += 8
      byteOffset += Math.floor(bitOffset / 8)
      bitOffset %= 8
    }
    
    players.push({ name: TEXT_DECODER.decode(nameBytes) })
  }
  
  return { value: players, nextOffset: dataOffset + totalBytes }
}

// ============================================================================
// Matches Encoding/Decoding
// ============================================================================

function encodeMatches(matches: StoredMatch[]): Uint8Array {
  const buffers: Uint8Array[] = []
  
  // Write match count (varint)
  if (matches.length < 128) {
    buffers.push(new Uint8Array([matches.length]))
  } else {
    const countBytes = new Uint8Array(2)
    countBytes[0] = (matches.length & 0x7F) | 0x80
    countBytes[1] = (matches.length >> 7) & 0xFF
    buffers.push(countBytes)
  }
  
  // Encode each match
  for (const match of matches) {
    buffers.push(encodeMatch(match))
  }
  
  return concatenateBuffers(buffers)
}

function encodeMatch(match: StoredMatch): Uint8Array {
  const hasScores = match.isFinished && match.winner !== undefined && match.scoreDelta !== undefined
  const buffer = new Uint8Array(hasScores ? 4 : 3)
  
  // Pack 25 bits into 3 bytes
  let packed = 0
  packed |= (match.isFinished ? 1 : 0) << 0
  packed |= (match.team1[0] & 0x3F) << 1
  packed |= (match.team1[1] & 0x3F) << 7
  packed |= (match.team2[0] & 0x3F) << 13
  packed |= (match.team2[1] & 0x3F) << 19
  
  buffer[0] = packed & 0xFF
  buffer[1] = (packed >> 8) & 0xFF
  buffer[2] = (packed >> 16) & 0xFF
  
  if (hasScores) {
    let scorePacked = 0
    scorePacked |= (match.winner! & 0x1) << 0
    scorePacked |= (match.scoreDelta! & 0x3F) << 1
    buffer[3] = scorePacked
  }
  
  return buffer
}

function decodeMatches(data: Uint8Array, offset: number): { value: StoredMatch[]; nextOffset: number } {
  // Read match count
  const countByte = data[offset]
  let matchCount: number
  
  if (countByte & 0x80) {
    matchCount = (countByte & 0x7F) | (data[offset + 1] << 7)
    offset += 2
  } else {
    matchCount = countByte
    offset += 1
  }
  
  const matches: StoredMatch[] = []
  
  for (let i = 0; i < matchCount; i++) {
    // Read 3 bytes
    const packed = data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16)
    
    const isFinished = Boolean(packed & 1)
    const team1_0 = (packed >> 1) & 0x3F
    const team1_1 = (packed >> 7) & 0x3F
    const team2_0 = (packed >> 13) & 0x3F
    const team2_1 = (packed >> 19) & 0x3F
    
    offset += 3
    
    let winner: number | undefined
    let scoreDelta: number | undefined
    
    if (isFinished) {
      const scorePacked = data[offset]
      winner = scorePacked & 0x1
      scoreDelta = (scorePacked >> 1) & 0x3F
      offset += 1
    }
    
    matches.push({
      team1: [team1_0, team1_1],
      team2: [team2_0, team2_1],
      isFinished,
      winner,
      scoreDelta,
    })
  }
  
  return { value: matches, nextOffset: offset }
}

// ============================================================================
// Bit Manipulation Helpers
// ============================================================================

function writeBits(buffer: Uint8Array, byteOffset: number, bitOffset: number, value: number, bitCount: number): void {
  for (let i = 0; i < bitCount; i++) {
    const bit = (value >> i) & 1
    const bytePos = byteOffset + Math.floor((bitOffset + i) / 8)
    const bitPos = (bitOffset + i) % 8
    
    if (bit) {
      buffer[bytePos] |= (1 << bitPos)
    }
  }
}

function readBits(buffer: Uint8Array, byteOffset: number, bitOffset: number, bitCount: number): number {
  let value = 0
  
  for (let i = 0; i < bitCount; i++) {
    const bytePos = byteOffset + Math.floor((bitOffset + i) / 8)
    const bitPos = (bitOffset + i) % 8
    const bit = (buffer[bytePos] >> bitPos) & 1
    
    value |= (bit << i)
  }
  
  return value
}

// ============================================================================
// Utility Functions
// ============================================================================

function concatenateBuffers(buffers: Uint8Array[]): Uint8Array {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0)
  const result = new Uint8Array(totalLength)
  let offset = 0
  
  for (const buffer of buffers) {
    result.set(buffer, offset)
    offset += buffer.length
  }
  
  return result
}

/**
 * Encodes binary data to base64url (URL-safe base64)
 */
export function encodeBase64Url(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

/**
 * Decodes base64url to binary data
 */
export function decodeBase64Url(str: string): Uint8Array {
  // Add padding back
  const padding = (4 - (str.length % 4)) % 4
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding)
  
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  
  return bytes
}
