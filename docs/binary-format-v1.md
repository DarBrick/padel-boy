# Binary Tournament Data Format v1

**Version:** 1  
**Last Updated:** February 5, 2026  
**Purpose:** Compact binary encoding for tournament data suitable for URL sharing and localStorage storage

## Design Goals

- **Compact:** Minimize byte size for URL sharing (target < 3000 chars base64url)
- **Efficient:** Bit-level packing for small values and enums
- **Deterministic:** Same tournament data always encodes to same binary output
- **Readable:** Clear structure with version header for future migrations

## Constraints

| Field | Constraint |
|-------|------------|
| Tournament name | 1-40 UTF-8 characters |
| Player name | 1-16 UTF-8 characters |
| Court name | 1-16 UTF-8 characters |
| Player count | 4-40 players |
| Court count | 1-10 courts |
| Max rounds | 40 rounds |
| Points per match | 16, 21, 24, or 32 |

## Binary Structure

### Header (4 bytes)

```
Byte 0: Version (0x01)

Byte 1-3: Packed Metadata (24 bits)
  Bit 0:     format (0=americano, 1=mexicano)
  Bit 1-2:   pointsPerGame (00=16, 01=21, 10=24, 11=32)
  Bit 3-6:   numberOfCourts (0-15, constrained 1-10)
  Bit 7:     isFixedPairs (1 if tournament uses fixed pairs)
  Bit 8:     mexicanoMatchupStyle (0='1&4vs2&3', 1='1&3vs2&4')
  Bit 9-11:  mexicanoRandomRounds (0-7, constrained 1-5)
  Bit 12-17: playerCount (0-63, constrained 4-40)
  Bit 18:    hasCustomName (1 if custom tournament name)
  Bit 19:    hasCustomCourtNames (1 if custom court names)
  Bit 20-23: RESERVED (must be 0)
```

### Tournament ID (9 bytes, fixed)

ASCII-encoded base36 string:
- 5 characters: timestamp offset from epoch (2025-01-01)
- 4 characters: random component
- Total: 9 ASCII bytes (0x30-0x39, 0x61-0x7A)

**Generation:**
```javascript
const TOURNAMENT_EPOCH = new Date('2025-01-01').getTime()
const timestamp = (Date.now() - TOURNAMENT_EPOCH).toString(36).padStart(5, '0')
const random = Math.random().toString(36).slice(2, 6)
return timestamp + random // 9 chars
```

### Tournament Name (conditional)

Only present if `hasCustomName=1` in header:
```
Byte 0:     Length (1-40)
Byte 1-n:   UTF-8 encoded name
```

If `hasCustomName=0`, use auto-generated name based on format and timestamp.

### Custom Court Names (conditional)

Only present if `hasCustomCourtNames=1` in header:
```
Byte 0-1: Court override bitmask (10 bits, 6 bits padding)
  Bit 0-9:  Each bit=1 indicates court N has custom name
  Bit 10-15: Padding (must be 0)

For each court with bit=1 (in order 1-10):
  Byte 0:     Length (1-16)
  Byte 1-n:   UTF-8 encoded court name
```

**Default names:** "Court 1", "Court 2", ... "Court 10"

### Players Array (bit-packed)

```
Byte 0-1: Total byte length of player names section (varint encoding)
  If byte 0 bit 7 = 0: length is bits 0-6 (0-127)
  If byte 0 bit 7 = 1: length continues in byte 1

For each player (playerCount from header):
  Bits 0-4:   Name length (0-31, constrained 1-16)
  Bits 5-n:   UTF-8 encoded name

Note: Names are bit-packed continuously across byte boundaries
```

**Bit-packing example:**
```
Player 1: length=4, name="John"
Player 2: length=5, name="Alice"

Binary layout:
[00100] [01001010] [01101111] [01101000] [01101110] [00101] [01000001] ...
  ^len   ^'J'       ^'o'       ^'h'       ^'n'       ^len   ^'A'
```

### Matches Array

```
Byte 0: Match count (varint 7-bit encoding)
  If bit 7 = 0: count is bits 0-6 (0-127)
  If bit 7 = 1: count continues in next byte

For each match (sorted by round, then court):
  Byte 0-2: Packed Match Data (25 bits packed into 3 bytes)
    Bit 0:     isFinished (0=not finished, 1=finished)
    Bit 1-6:   team1[0] player index (0-39)
    Bit 7-12:  team1[1] player index (0-39)
    Bit 13-18: team2[0] player index (0-39)
    Bit 19-24: team2[1] player index (0-39)
    Bit 25-31: Padding (unused in bytes 0-2)
  
  IF isFinished=1:
    Byte 3: Packed Score Delta
      Bit 0:    winner (0=team1, 1=team2)
      Bit 1-6:  point difference (0-63)
      Bit 7:    RESERVED (must be 0)
```

**Match ordering:** Matches MUST be sorted by round number (ascending), then by court number (ascending). This allows court and round derivation from match index.

**Deriving court and round:**
```javascript
const matchesPerRound = Math.floor(playerCount / 2) * (numberOfCourts / numberOfCourts)
const roundNumber = Math.floor(matchIndex / matchesPerRound) + 1
const courtNumber = (matchIndex % numberOfCourts) + 1
```

**Score reconstruction:**
```javascript
if (isFinished) {
  const winnerScore = pointsPerGame
  const loserScore = pointsPerGame - delta
  const [score1, score2] = winner === 0 
    ? [winnerScore, loserScore] 
    : [loserScore, winnerScore]
}
```

## Encoding Algorithm

1. **Write header** (4 bytes)
2. **Write tournament ID** (9 bytes ASCII)
3. **Write tournament name** (if custom)
4. **Write court names** (if custom)
5. **Encode player names:**
   - Calculate total byte size
   - Write varint length prefix
   - Write bit-packed names (5-bit length + UTF-8 bytes)
6. **Encode matches:**
   - Sort by round, then court
   - Write varint match count
   - For each match: write 3-byte packed data + optional 1-byte score

## Decoding Algorithm

1. **Read header** (4 bytes) → extract all metadata flags
2. **Read tournament ID** (9 bytes)
3. **Read tournament name** (if hasCustomName=1)
4. **Read court names** (if hasCustomCourtNames=1)
5. **Read player names:**
   - Read varint length prefix
   - Read bit-packed names using playerCount from header
6. **Read matches:**
   - Read varint match count
   - For each match: read 3 bytes + optional score byte
   - Derive court/round from match index

## Size Estimates

| Tournament Size | Players | Courts | Matches | Estimated Size | Base64url |
|-----------------|---------|--------|---------|----------------|-----------|
| Small | 8 | 1 | 20 | ~164 bytes | ~219 chars |
| Medium | 16 | 4 | 100 | ~627 bytes | ~836 chars |
| Large | 40 | 10 | 400 | ~1986 bytes | ~2648 chars |

## Validation Rules

Decoders MUST validate:
- Version byte = 0x01
- Reserved bits = 0
- playerCount: 4-40
- numberOfCourts: 1-10
- Player indices: 0 to (playerCount - 1)
- Match count ≤ 65535
- String lengths within bounds
- UTF-8 validity

## Future Versions

Version byte allows format evolution. Future versions may:
- Add new header bits (use currently reserved bits)
- Compress match data further
- Add optional sections (replays, timestamps, player ratings)

Breaking changes require incrementing version byte.
