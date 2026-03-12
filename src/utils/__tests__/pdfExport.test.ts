import { describe, expect, it } from 'vitest'
import en from '../../locales/en'
import type { StoredMatch, StoredTournament } from '../../schemas/tournament'
import { buildTournamentResultsPdfData } from '../pdfExport'

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
    id: 'test12345',
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

describe('buildTournamentResultsPdfData', () => {
  const t = ((key: string, options?: Record<string, unknown>) => {
    const segments = key.split('.')
    let value: unknown = en.translation

    for (const segment of segments) {
      if (!value || typeof value !== 'object' || !(segment in value)) {
        return key
      }
      value = (value as Record<string, unknown>)[segment]
    }

    if (typeof value !== 'string') {
      return key
    }

    return value.replace(/\{\{(\w+)\}\}/g, (_, token: string) => String(options?.[token] ?? ''))
  }) as never

  it('builds summary, standings, and rounds from tournament data', () => {
    const pdfData = buildTournamentResultsPdfData(createTournament(), {
      locale: 'en-GB',
      t,
    })

    expect(pdfData.title).toBe('Spring Open 2026')
    expect(pdfData.summaryRows).toEqual([
      ['Format', 'Americano'],
      ['Players', '6'],
      ['Finished', '12 Mar 2026'],
      ['Rounds', '2'],
      ['Matches', '2/2'],
    ])
    expect(pdfData.standingsRows[0]).toEqual(['1', 'Bob', '2/0/0', '100%', '29', '+5', '14.5'])
    expect(pdfData.standingsRows).toContainEqual(['3', 'Alice', '1/0/1', '50%', '23', '-1', '11.5'])
    expect(pdfData.rounds).toHaveLength(2)
    expect(pdfData.rounds[0]).toEqual({
      roundNumber: 1,
      matches: [
        {
          team1: 'Alice / Bob',
          score: '14 : 10',
          team2: 'Charlie / Diana',
        },
      ],
      pausingPlayers: ['Eve', 'Frank'],
    })
    expect(pdfData.rounds[1].matches[0]?.score).toBe('9 : 15')
    expect(pdfData.rounds[1].pausingPlayers).toEqual(['Eve', 'Frank'])
  })

  it('uses sanitized filenames and includes optional summary fields', () => {
    const pdfData = buildTournamentResultsPdfData(
      createTournament({
        format: 'mexicano',
        name: 'Świąteczny Open!',
        isFixedPairs: true,
        mexicanoMatchupStyle: '1&4vs2&3',
        mexicanoRandomRounds: 2,
      }),
      {
        locale: 'en-GB',
        t,
      },
    )

    expect(pdfData.filename).toBe('swiateczny-open-12-03-2026.pdf')
    expect(pdfData.summaryRows).toContainEqual(['Pairing', '1&4vs2&3'])
    expect(pdfData.summaryRows).toContainEqual(['Random Rounds', '2'])
    expect(pdfData.summaryRows).toContainEqual(['Fixed Pairs', 'Yes'])
  })
})