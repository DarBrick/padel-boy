import { describe, expect, it } from 'vitest'
import type { StoredMatch, StoredTournament } from '../../schemas/tournament'
import { MAX_TOURNAMENT_QR_URL_LENGTH, generateTournamentQrDataUrl, getTournamentQrAvailability } from '../qrExport'
import { buildTournamentShareUrl, getTournamentShareUrl } from '../shareHelper'

function createMatch(
  team1: [number, number],
  team2: [number, number],
  isFinished: boolean,
  winner?: 0 | 1,
  scoreDelta?: number,
): StoredMatch {
  return {
    team1,
    team2,
    isFinished,
    winner,
    scoreDelta,
  }
}

function createTournament(overrides: Partial<StoredTournament> = {}): StoredTournament {
  return {
    version: 1,
    format: 'americano',
    pointsPerGame: 24,
    numberOfCourts: 1,
    isFixedPairs: false,
    playerCount: 6,
    id: 'share12345',
    name: 'Spring Open 2026',
    players: [
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Diana' },
      { name: 'Eve' },
      { name: 'Frank' },
    ],
    matches: [
      createMatch([0, 1], [2, 3], true, 0, 4),
      createMatch([0, 2], [1, 3], true, 1, 6),
    ],
    finishedAt: Date.UTC(2026, 2, 12, 18, 45, 0),
    ...overrides,
  }
}

describe('getTournamentShareUrl', () => {
  it('builds a local shared route URL by default', () => {
    const shareUrl = getTournamentShareUrl(createTournament())

    expect(shareUrl).toMatch(/^http:\/\/localhost:\d+\/#\/shared\//)
  })

  it('builds a GitHub Pages shared route when given the project basename', () => {
    const shareUrl = buildTournamentShareUrl('https://darek.github.io', '/padel-boy', 'encoded-data')

    expect(shareUrl).toBe('https://darek.github.io/padel-boy/#/shared/encoded-data')
  })
})

describe('tournament QR export helpers', () => {
  it('marks compact tournament URLs as QR eligible', () => {
    const availability = getTournamentQrAvailability(createTournament())

    expect(availability.isAvailable).toBe(true)
    expect(availability.shareUrl).toMatch(/^http:\/\/localhost:\d+\/#\/shared\//)
    expect(availability.urlLength).toBeLessThanOrEqual(MAX_TOURNAMENT_QR_URL_LENGTH)
  })

  it('rejects payloads that exceed the QR size limit', async () => {
    const tooLargeUrl = `https://example.com/#/shared/${'a'.repeat(MAX_TOURNAMENT_QR_URL_LENGTH)}`

    await expect(generateTournamentQrDataUrl(tooLargeUrl)).rejects.toThrow(
      'Tournament QR payload exceeds supported size',
    )
  })
})