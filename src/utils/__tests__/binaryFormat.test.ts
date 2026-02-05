import { describe, it, expect } from 'vitest'
import { encodeTournament, decodeTournament, encodeBase64Url, decodeBase64Url } from '../binaryFormat'
import type { StoredTournament } from '../../schemas/tournament'

describe('Binary Tournament Format v1', () => {
  describe('Basic Americano Tournament', () => {
    it('should encode and decode tournament with auto-generated name', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 8,
        id: 'abc123456',
        players: [
          { name: 'Alice' },
          { name: 'Bob' },
          { name: 'Charlie' },
          { name: 'Diana' },
          { name: 'Eve' },
          { name: 'Frank' },
          { name: 'Grace' },
          { name: 'Henry' },
        ],
        matches: [
          {
            team1: [0, 1],
            team2: [2, 3],
            isFinished: false,
          },
          {
            team1: [4, 5],
            team2: [6, 7],
            isFinished: false,
          },
        ],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.version).toBe(1)
      expect(decoded.format).toBe('americano')
      expect(decoded.pointsPerGame).toBe(21)
      expect(decoded.numberOfCourts).toBe(2)
      expect(decoded.isFixedPairs).toBe(false)
      expect(decoded.playerCount).toBe(8)
      expect(decoded.id).toBe('abc123456')
      expect(decoded.name).toBeUndefined()
      expect(decoded.players).toHaveLength(8)
      expect(decoded.players[0].name).toBe('Alice')
      expect(decoded.matches).toHaveLength(2)
      expect(decoded.matches[0].isFinished).toBe(false)
    })

    it('should encode and decode tournament with custom name', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 16,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'xyz789012',
        name: 'Friday Night Padel',
        players: [
          { name: 'Ana' },
          { name: 'Ben' },
          { name: 'Carl' },
          { name: 'Dina' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.name).toBe('Friday Night Padel')
      expect(decoded.playerCount).toBe(4)
    })

    it('should handle finished matches with scores', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 24,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'def456789',
        players: [
          { name: 'Player1' },
          { name: 'Player2' },
          { name: 'Player3' },
          { name: 'Player4' },
        ],
        matches: [
          {
            team1: [0, 1],
            team2: [2, 3],
            isFinished: true,
            winner: 0,
            scoreDelta: 4, // 24-20
          },
          {
            team1: [0, 2],
            team2: [1, 3],
            isFinished: true,
            winner: 1,
            scoreDelta: 8, // 16-24
          },
        ],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.matches).toHaveLength(2)
      expect(decoded.matches[0].isFinished).toBe(true)
      expect(decoded.matches[0].winner).toBe(0)
      expect(decoded.matches[0].scoreDelta).toBe(4)
      expect(decoded.matches[1].isFinished).toBe(true)
      expect(decoded.matches[1].winner).toBe(1)
      expect(decoded.matches[1].scoreDelta).toBe(8)
    })
  })

  describe('Mexicano Tournament', () => {
    it('should encode and decode mexicano-specific fields', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'mexicano',
        pointsPerGame: 32,
        numberOfCourts: 3,
        isFixedPairs: true,
        playerCount: 12,
        mexicanoMatchupStyle: '1&3vs2&4',
        mexicanoRandomRounds: 3,
        id: 'mex123456',
        players: [
          { name: 'P1' },
          { name: 'P2' },
          { name: 'P3' },
          { name: 'P4' },
          { name: 'P5' },
          { name: 'P6' },
          { name: 'P7' },
          { name: 'P8' },
          { name: 'P9' },
          { name: 'P10' },
          { name: 'P11' },
          { name: 'P12' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.format).toBe('mexicano')
      expect(decoded.mexicanoMatchupStyle).toBe('1&3vs2&4')
      expect(decoded.mexicanoRandomRounds).toBe(3)
      expect(decoded.isFixedPairs).toBe(true)
    })

    it('should encode alternative mexicano matchup style', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'mexicano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 8,
        mexicanoMatchupStyle: '1&4vs2&3',
        mexicanoRandomRounds: 5,
        id: 'mex789abc',
        players: Array.from({ length: 8 }, (_, i) => ({ name: `Player${i + 1}` })),
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.mexicanoMatchupStyle).toBe('1&4vs2&3')
      expect(decoded.mexicanoRandomRounds).toBe(5)
    })
  })

  describe('UTF-8 and Diacritic Characters', () => {
    it('should handle diacritic characters in player names', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 8,
        id: 'utf890123',
        name: 'Tournée Française',
        players: [
          { name: 'José' },
          { name: 'María' },
          { name: 'Łukasz' },
          { name: 'Zoë' },
          { name: 'François' },
          { name: 'Søren' },
          { name: 'Ñoño' },
          { name: 'Müller' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.name).toBe('Tournée Française')
      expect(decoded.players[0].name).toBe('José')
      expect(decoded.players[1].name).toBe('María')
      expect(decoded.players[2].name).toBe('Łukasz')
      expect(decoded.players[3].name).toBe('Zoë')
      expect(decoded.players[4].name).toBe('François')
      expect(decoded.players[5].name).toBe('Søren')
      expect(decoded.players[6].name).toBe('Ñoño')
      expect(decoded.players[7].name).toBe('Müller')
    })

    it('should handle emojis and complex unicode in tournament name', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 16,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'emo123456',
        name: '🎾 Padel Champions 🏆',
        players: [
          { name: 'João' },
          { name: 'Andrés' },
          { name: 'Michał' },
          { name: 'Björn' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.name).toBe('🎾 Padel Champions 🏆')
    })

    it('should handle Asian characters', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'asn123456',
        players: [
          { name: '山田太郎' }, // Japanese
          { name: '李明' }, // Chinese
          { name: '김민준' }, // Korean
          { name: 'Nguyễn Văn' }, // Vietnamese
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.players[0].name).toBe('山田太郎')
      expect(decoded.players[1].name).toBe('李明')
      expect(decoded.players[2].name).toBe('김민준')
      expect(decoded.players[3].name).toBe('Nguyễn Văn')
    })
  })

  describe('Custom Court Names', () => {
    it('should encode and decode custom court names', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 3,
        isFixedPairs: false,
        playerCount: 6,
        id: 'crt123456',
        courtNames: {
          0: 'Center Court',
          2: 'Court C',
        },
        players: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' },
          { name: 'E' },
          { name: 'F' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.courtNames).toBeDefined()
      expect(decoded.courtNames![0]).toBe('Center Court')
      expect(decoded.courtNames![1]).toBeUndefined()
      expect(decoded.courtNames![2]).toBe('Court C')
    })

    it('should handle all courts with custom names', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 4,
        isFixedPairs: false,
        playerCount: 8,
        id: 'crt789abc',
        courtNames: {
          0: 'Alpha',
          1: 'Beta',
          2: 'Gamma',
          3: 'Delta',
        },
        players: Array.from({ length: 8 }, (_, i) => ({ name: `P${i + 1}` })),
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.courtNames![0]).toBe('Alpha')
      expect(decoded.courtNames![1]).toBe('Beta')
      expect(decoded.courtNames![2]).toBe('Gamma')
      expect(decoded.courtNames![3]).toBe('Delta')
    })
  })

  describe('Mixed Scenarios', () => {
    it('should handle tournament with mix of finished and unfinished matches', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 8,
        id: 'mix123456',
        name: 'Mixed Tournament',
        players: Array.from({ length: 8 }, (_, i) => ({ name: `Player ${i + 1}` })),
        matches: [
          {
            team1: [0, 1],
            team2: [2, 3],
            isFinished: true,
            winner: 0,
            scoreDelta: 3,
          },
          {
            team1: [4, 5],
            team2: [6, 7],
            isFinished: false,
          },
          {
            team1: [0, 2],
            team2: [1, 3],
            isFinished: true,
            winner: 1,
            scoreDelta: 5,
          },
          {
            team1: [4, 6],
            team2: [5, 7],
            isFinished: false,
          },
        ],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.matches).toHaveLength(4)
      expect(decoded.matches[0].isFinished).toBe(true)
      expect(decoded.matches[1].isFinished).toBe(false)
      expect(decoded.matches[2].isFinished).toBe(true)
      expect(decoded.matches[3].isFinished).toBe(false)
    })

    it('should handle large tournament with 40 players', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 32,
        numberOfCourts: 10,
        isFixedPairs: false,
        playerCount: 40,
        id: 'big123456',
        players: Array.from({ length: 40 }, (_, i) => ({ name: `Player${i + 1}` })),
        matches: Array.from({ length: 100 }, (_, i) => ({
          team1: [(i * 4) % 40, ((i * 4) + 1) % 40] as [number, number],
          team2: [((i * 4) + 2) % 40, ((i * 4) + 3) % 40] as [number, number],
          isFinished: i % 3 === 0,
          winner: i % 3 === 0 ? (i % 2) as 0 | 1 : undefined,
          scoreDelta: i % 3 === 0 ? (i % 10) : undefined,
        })),
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.playerCount).toBe(40)
      expect(decoded.players).toHaveLength(40)
      expect(decoded.matches).toHaveLength(100)
      expect(decoded.numberOfCourts).toBe(10)
    })
  })

  describe('Base64URL Encoding', () => {
    it('should encode to valid base64url format', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'b64123456',
        players: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' },
        ],
        matches: [],
      }

      const binary = encodeTournament(tournament)
      const base64url = encodeBase64Url(binary)

      // Should not contain +, /, or =
      expect(base64url).not.toContain('+')
      expect(base64url).not.toContain('/')
      expect(base64url).not.toContain('=')

      // Should be URL-safe
      expect(base64url).toMatch(/^[A-Za-z0-9_-]+$/)
    })

    it('should round-trip through base64url encoding', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'mexicano',
        pointsPerGame: 24,
        numberOfCourts: 3,
        isFixedPairs: true,
        playerCount: 12,
        mexicanoMatchupStyle: '1&4vs2&3',
        mexicanoRandomRounds: 2,
        id: 'rnd123456',
        name: 'Round Trip Test',
        courtNames: {
          0: 'Main',
          1: 'Side',
        },
        players: Array.from({ length: 12 }, (_, i) => ({ name: `P${i + 1}` })),
        matches: Array.from({ length: 20 }, (_, i) => ({
          team1: [(i * 2) % 12, ((i * 2) + 1) % 12] as [number, number],
          team2: [((i * 2) + 2) % 12, ((i * 2) + 3) % 12] as [number, number],
          isFinished: i < 10,
          winner: i < 10 ? (i % 2) as 0 | 1 : undefined,
          scoreDelta: i < 10 ? (i % 5) + 1 : undefined,
        })),
      }

      const binary = encodeTournament(tournament)
      const base64url = encodeBase64Url(binary)
      const decodedBinary = decodeBase64Url(base64url)
      const decoded = decodeTournament(decodedBinary)

      expect(decoded.name).toBe('Round Trip Test')
      expect(decoded.players).toHaveLength(12)
      expect(decoded.matches).toHaveLength(20)
      expect(decoded.mexicanoMatchupStyle).toBe('1&4vs2&3')
    })
  })

  describe('Edge Cases', () => {
    it('should handle minimum valid tournament (4 players, 1 court)', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 16,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'min123456',
        players: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.playerCount).toBe(4)
      expect(decoded.numberOfCourts).toBe(1)
    })

    it('should handle zero-delta score (tie)', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'tie123456',
        players: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' },
        ],
        matches: [
          {
            team1: [0, 1],
            team2: [2, 3],
            isFinished: true,
            winner: 0,
            scoreDelta: 0, // 21-21 (though shouldn't happen in padel)
          },
        ],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.matches[0].scoreDelta).toBe(0)
    })

    it('should handle single-character player names', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'chr123456',
        players: [
          { name: 'A' },
          { name: 'B' },
          { name: 'C' },
          { name: 'D' },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.players.map(p => p.name)).toEqual(['A', 'B', 'C', 'D'])
    })

    it('should handle maximum-length names', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 4,
        id: 'max123456',
        name: 'A'.repeat(40), // Max tournament name length
        players: [
          { name: 'B'.repeat(16) }, // Max player name length
          { name: 'C'.repeat(16) },
          { name: 'D'.repeat(16) },
          { name: 'E'.repeat(16) },
        ],
        matches: [],
      }

      const encoded = encodeTournament(tournament)
      const decoded = decodeTournament(encoded)

      expect(decoded.name).toBe('A'.repeat(40))
      expect(decoded.players[0].name).toBe('B'.repeat(16))
    })
  })

  describe('Size Validation', () => {
    it('should produce compact binary for small tournament', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 1,
        isFixedPairs: false,
        playerCount: 8,
        id: 'sml123456',
        players: Array.from({ length: 8 }, (_, i) => ({ name: `P${i}` })),
        matches: Array.from({ length: 14 }, (_, i) => ({
          team1: [(i * 2) % 8, ((i * 2) + 1) % 8] as [number, number],
          team2: [((i * 2) + 2) % 8, ((i * 2) + 3) % 8] as [number, number],
          isFinished: true,
          winner: (i % 2) as 0 | 1,
          scoreDelta: 5,
        })),
      }

      const binary = encodeTournament(tournament)
      const base64url = encodeBase64Url(binary)

      // Should be under 200 bytes
      expect(binary.length).toBeLessThan(200)
      // Base64url should be under 300 chars
      expect(base64url.length).toBeLessThan(300)
    })

    it('should produce compact binary for large tournament', () => {
      const tournament: StoredTournament = {
        version: 1,
        format: 'americano',
        pointsPerGame: 32,
        numberOfCourts: 10,
        isFixedPairs: false,
        playerCount: 40,
        id: 'lrg123456',
        players: Array.from({ length: 40 }, (_, i) => ({ name: `Player${i}` })),
        matches: Array.from({ length: 400 }, (_, i) => ({
          team1: [(i * 4) % 40, ((i * 4) + 1) % 40] as [number, number],
          team2: [((i * 4) + 2) % 40, ((i * 4) + 3) % 40] as [number, number],
          isFinished: i < 200,
          winner: i < 200 ? (i % 2) as 0 | 1 : undefined,
          scoreDelta: i < 200 ? (i % 10) : undefined,
        })),
      }

      const binary = encodeTournament(tournament)
      const base64url = encodeBase64Url(binary)

      // Should be under 3KB
      expect(binary.length).toBeLessThan(3000)
      // Base64url should be under 4000 chars (well within URL limits)
      expect(base64url.length).toBeLessThan(4000)
    })
  })
})
