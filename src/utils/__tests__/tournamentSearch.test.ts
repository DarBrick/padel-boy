import { describe, it, expect } from 'vitest'
import { normalizeText, filterTournamentsBySearch, getTournamentStatus } from '../tournamentSearch'
import type { StoredTournament } from '../../schemas/tournament'

describe('normalizeText', () => {
  it('should remove accents from text', () => {
    expect(normalizeText('Łukasz')).toBe('Lukasz')
    expect(normalizeText('Hernán')).toBe('Hernan')
    expect(normalizeText('José')).toBe('Jose')
    expect(normalizeText('François')).toBe('Francois')
    expect(normalizeText('Müller')).toBe('Muller')
  })
  
  it('should handle German umlauts', () => {
    expect(normalizeText('Müller')).toBe('Muller')
    expect(normalizeText('Größe')).toBe('Grosse')
    expect(normalizeText('Bäcker')).toBe('Backer')
    expect(normalizeText('Übung')).toBe('Ubung')
    expect(normalizeText('Äpfel')).toBe('Apfel')
    expect(normalizeText('Öl')).toBe('Ol')
  })
  
  it('should handle French accents', () => {
    expect(normalizeText('Frédéric')).toBe('Frederic')
    expect(normalizeText('Hélène')).toBe('Helene')
    expect(normalizeText('André')).toBe('Andre')
    expect(normalizeText('François')).toBe('Francois')
    expect(normalizeText('Geneviève')).toBe('Genevieve')
    expect(normalizeText('Jérôme')).toBe('Jerome')
  })
  
  it('should handle Spanish characters', () => {
    expect(normalizeText('Peña')).toBe('Pena')
    expect(normalizeText('Señor')).toBe('Senor')
    expect(normalizeText('José')).toBe('Jose')
    expect(normalizeText('María')).toBe('Maria')
    expect(normalizeText('Iñigo')).toBe('Inigo')
  })
  
  it('should handle Polish characters', () => {
    expect(normalizeText('Łukasz')).toBe('Lukasz')
    expect(normalizeText('Ądam')).toBe('Adam')
    expect(normalizeText('Ęwa')).toBe('Ewa')
    expect(normalizeText('Ćwiączyński')).toBe('Cwiaczynski')
    expect(normalizeText('Łódź')).toBe('Lodz')
    expect(normalizeText('Kędzierski')).toBe('Kedzierski')
    expect(normalizeText('Mateński')).toBe('Matenski')
    expect(normalizeText('Ślązak')).toBe('Slazak')
    expect(normalizeText('Źdźbło')).toBe('Zdzblo')
    expect(normalizeText('Żukowski')).toBe('Zukowski')
    expect(normalizeText('Grzegorz')).toBe('Grzegorz')
    expect(normalizeText('Szczęsny')).toBe('Szczesny')
  })
  
  it('should handle all Polish diacritics (lowercase)', () => {
    expect(normalizeText('ą')).toBe('a')
    expect(normalizeText('ę')).toBe('e')
    expect(normalizeText('ć')).toBe('c')
    expect(normalizeText('ł')).toBe('l')
    expect(normalizeText('ń')).toBe('n')
    expect(normalizeText('ó')).toBe('o')
    expect(normalizeText('ś')).toBe('s')
    expect(normalizeText('ź')).toBe('z')
    expect(normalizeText('ż')).toBe('z')
  })
  
  it('should handle all Polish diacritics (uppercase)', () => {
    expect(normalizeText('Ą')).toBe('A')
    expect(normalizeText('Ę')).toBe('E')
    expect(normalizeText('Ć')).toBe('C')
    expect(normalizeText('Ł')).toBe('L')
    expect(normalizeText('Ń')).toBe('N')
    expect(normalizeText('Ó')).toBe('O')
    expect(normalizeText('Ś')).toBe('S')
    expect(normalizeText('Ź')).toBe('Z')
    expect(normalizeText('Ż')).toBe('Z')
  })
  
  it('should handle Portuguese characters', () => {
    expect(normalizeText('João')).toBe('Joao')
    expect(normalizeText('São')).toBe('Sao')
    expect(normalizeText('Gonçalves')).toBe('Goncalves')
    expect(normalizeText('Português')).toBe('Portugues')
  })
  
  it('should handle Scandinavian characters', () => {
    expect(normalizeText('Bjørn')).toBe('Bjorn')
    expect(normalizeText('Søren')).toBe('Soren')
    expect(normalizeText('Åse')).toBe('Ase')
    expect(normalizeText('Æther')).toBe('AEther')
  })
  
  it('should handle Czech/Slovak characters', () => {
    expect(normalizeText('Petr')).toBe('Petr')
    expect(normalizeText('Dvořák')).toBe('Dvorak')
    expect(normalizeText('Lukáš')).toBe('Lukas')
    expect(normalizeText('Tomáš')).toBe('Tomas')
  })
  
  it('should handle Turkish characters', () => {
    expect(normalizeText('Güneş')).toBe('Gunes')
    expect(normalizeText('Çağlar')).toBe('Caglar')
    expect(normalizeText('Tuğba')).toBe('Tugba')
  })

  it('should handle text without accents', () => {
    expect(normalizeText('John')).toBe('John')
    expect(normalizeText('Summer')).toBe('Summer')
  })

  it('should handle empty strings', () => {
    expect(normalizeText('')).toBe('')
  })

  it('should preserve case', () => {
    expect(normalizeText('ŁUKASZ')).toBe('LUKASZ')
    expect(normalizeText('łukasz')).toBe('lukasz')
  })
})

describe('filterTournamentsBySearch', () => {
  const mockTournaments: StoredTournament[] = [
    {
      id: '1',
      version: 1,
      name: 'Summer Tournament',
      createdAt: new Date('2024-01-01').toISOString(),
      format: 'americano',
      pointsPerGame: 21,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [
        { name: 'John Smith' },
        { name: 'Alice Johnson' },
        { name: 'Bob Williams' },
        { name: 'Maria Garcia' }
      ],
      matches: []
    } as any,
    {
      id: '2',
      version: 1,
      name: 'Winter Championship',
      createdAt: new Date('2024-02-01').toISOString(),
      format: 'mexicano',
      pointsPerGame: 21,
      numberOfCourts: 3,
      isFixedPairs: false,
      playerCount: 4,
      mexicanoMatchupStyle: '1&4vs2&3',
      mexicanoRandomRounds: 2,
      players: [
        { name: 'Łukasz Kowalski' },
        { name: 'Hernán Rodriguez' },
        { name: 'Marie Dupont' },
        { name: 'Pedro Santos' }
      ],
      matches: []
    } as any,
    {
      id: '3',
      version: 1,
      name: 'Spring Finals',
      createdAt: new Date('2024-03-01').toISOString(),
      format: 'americano',
      pointsPerGame: 24,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [
        { name: 'John Doe' },
        { name: 'Sarah Brown' },
        { name: 'Mike Davis' },
        { name: 'Emma Wilson' }
      ],
      matches: []
    } as any
  ]

  describe('empty or whitespace queries', () => {
    it('should return all tournaments for empty query', () => {
      const result = filterTournamentsBySearch(mockTournaments, '')
      expect(result).toEqual(mockTournaments)
    })

    it('should return all tournaments for whitespace-only query', () => {
      const result = filterTournamentsBySearch(mockTournaments, '   ')
      expect(result).toEqual(mockTournaments)
    })
  })

  describe('single word search', () => {
    it('should filter by tournament name', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'summer')
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Summer Tournament')
    })

    it('should filter by player name', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'john')
      expect(result).toHaveLength(2)
      expect(result.map(t => t.id)).toContain('1')
      expect(result.map(t => t.id)).toContain('3')
    })

    it('should be case-insensitive', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'JOHN')
      expect(result).toHaveLength(2)
    })

    it('should match partial names', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'joh')
      expect(result).toHaveLength(2)
    })
  })

  describe('multi-word search', () => {
    it('should find tournaments matching all words in name and players', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'summer john')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should find tournaments matching multiple player names', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'john alice')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should return empty for non-matching combination', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'summer pedro')
      expect(result).toHaveLength(0)
    })

    it('should handle multiple spaces between words', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'summer    john')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  })

  describe('accent-insensitive search', () => {
    it('should match "lukas" to "Łukasz"', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'lukas')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should match "hernan" to "Hernán"', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'hernan')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should work with multiple accented names', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'lukas hernan')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should work with accents in query', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'Łukasz')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  })

  describe('edge cases', () => {
    it('should handle tournaments with no players', () => {
      const tournamentNoPlayers: StoredTournament = {
        ...mockTournaments[0],
        id: '99',
        players: []
      }
      const result = filterTournamentsBySearch([tournamentNoPlayers], 'john')
      expect(result).toHaveLength(0)
    })

    it('should handle tournaments with undefined name', () => {
      const tournamentNoName: StoredTournament = {
        ...mockTournaments[0],
        id: '99',
        name: undefined as any
      }
      const result = filterTournamentsBySearch([tournamentNoName], 'john')
      expect(result).toHaveLength(1) // Should still match by player
    })

    it('should handle players with undefined names', () => {
      const tournamentBadPlayer: StoredTournament = {
        ...mockTournaments[0],
        id: '99',
        players: [{ name: undefined as any }]
      }
      const result = filterTournamentsBySearch([tournamentBadPlayer], 'summer')
      expect(result).toHaveLength(1) // Should still match by tournament name
    })

    it('should return no results for non-matching query', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'nonexistent')
      expect(result).toHaveLength(0)
    })

    it('should handle special characters', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'garcía')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })
  })

  describe('intersection logic', () => {
    it('should require all words to match (AND logic)', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'john smith')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('1')
    })

    it('should not match if only some words match', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'john championship')
      expect(result).toHaveLength(0)
    })

    it('should match across name and players', () => {
      const result = filterTournamentsBySearch(mockTournaments, 'winter lukas')
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })
  })
  
  describe('real-world multilingual scenarios', () => {
    it('should find German name with umlaut using ASCII', () => {
      const germanTournaments: StoredTournament[] = [{
        id: '1',
        version: 1,
        name: 'Berlin Cup',
        createdAt: new Date().toISOString(),
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 2,
        players: [
          { name: 'Müller Schmidt' },
          { name: 'Anna Bäcker' }
        ],
        matches: []
      } as any]
      
      expect(filterTournamentsBySearch(germanTournaments, 'muller')).toHaveLength(1)
      expect(filterTournamentsBySearch(germanTournaments, 'backer')).toHaveLength(1)
    })
    
    it('should find French name with accents using ASCII', () => {
      const frenchTournaments: StoredTournament[] = [{
        id: '1',
        version: 1,
        name: 'Paris Open',
        createdAt: new Date().toISOString(),
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 2,
        players: [
          { name: 'Frédéric Dubois' },
          { name: 'Hélène Lefèvre' }
        ],
        matches: []
      } as any]
      
      expect(filterTournamentsBySearch(frenchTournaments, 'frederic')).toHaveLength(1)
      expect(filterTournamentsBySearch(frenchTournaments, 'helene')).toHaveLength(1)
    })
    
    it('should find Spanish name with ñ using n', () => {
      const spanishTournaments: StoredTournament[] = [{
        id: '1',
        version: 1,
        name: 'Madrid Masters',
        createdAt: new Date().toISOString(),
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 2,
        players: [
          { name: 'José Peña' },
          { name: 'María Núñez' }
        ],
        matches: []
      } as any]
      
      expect(filterTournamentsBySearch(spanishTournaments, 'pena')).toHaveLength(1)
      expect(filterTournamentsBySearch(spanishTournaments, 'nunez')).toHaveLength(1)
      expect(filterTournamentsBySearch(spanishTournaments, 'jose maria')).toHaveLength(1)
    })
    
    it('should handle mixed international names in same tournament', () => {
      const mixedTournaments: StoredTournament[] = [{
        id: '1',
        version: 1,
        name: 'International Cup',
        createdAt: new Date().toISOString(),
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 4,
        players: [
          { name: 'Łukasz Müller' },
          { name: 'Frédéric Bjørn' },
          { name: 'José González' },
          { name: 'João Silva' }
        ],
        matches: []
      } as any]
      
      expect(filterTournamentsBySearch(mixedTournaments, 'lukas muller')).toHaveLength(1)
      expect(filterTournamentsBySearch(mixedTournaments, 'frederic bjorn')).toHaveLength(1)
      expect(filterTournamentsBySearch(mixedTournaments, 'jose')).toHaveLength(1)
      expect(filterTournamentsBySearch(mixedTournaments, 'joao')).toHaveLength(1)
    })
    
    it('should handle Polish names with all diacritics using ASCII', () => {
      const polishTournaments: StoredTournament[] = [{
        id: '1',
        version: 1,
        name: 'Kraków Cup',
        createdAt: new Date().toISOString(),
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 4,
        players: [
          { name: 'Łukasz Kędzierski' },
          { name: 'Grzegorz Szczęsny' },
          { name: 'Agnieszka Ślązak' },
          { name: 'Wojciech Żukowski' }
        ],
        matches: []
      } as any]
      
      // Search with ASCII characters for all Polish diacritics
      expect(filterTournamentsBySearch(polishTournaments, 'lukasz')).toHaveLength(1)
      expect(filterTournamentsBySearch(polishTournaments, 'kedzierski')).toHaveLength(1)
      expect(filterTournamentsBySearch(polishTournaments, 'szczesny')).toHaveLength(1)
      expect(filterTournamentsBySearch(polishTournaments, 'slazak')).toHaveLength(1)
      expect(filterTournamentsBySearch(polishTournaments, 'zukowski')).toHaveLength(1)
      
      // Multi-word search
      expect(filterTournamentsBySearch(polishTournaments, 'lukasz kedzierski')).toHaveLength(1)
      expect(filterTournamentsBySearch(polishTournaments, 'grzegorz szczesny')).toHaveLength(1)
      
      // Search tournament name with Polish city
      expect(filterTournamentsBySearch(polishTournaments, 'krakow')).toHaveLength(1)
    })
  })
  
  describe('quick filters', () => {
    const filterTestTournaments: StoredTournament[] = [
      {
        id: '1',
        version: 1,
        name: 'Summer Americano',
        createdAt: new Date('2024-06-15').toISOString(),
        format: 'americano',
        pointsPerGame: 21,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 4,
        players: [
          { name: 'John Doe' },
          { name: 'Jane Smith' },
          { name: 'Mike Ross' },
          { name:'Sara Connor' }
        ],
        matches: [] // empty = setup status
      } as any,
      {
        id: '2',
        version: 1,
        name: 'Winter Mexicano',
        createdAt: new Date('2024-12-20').toISOString(),
        format: 'mexicano',
        pointsPerGame: 21,
        numberOfCourts: 3,
        isFixedPairs: false,
        playerCount: 4,
        mexicanoMatchupStyle: '1&4vs2&3',
        mexicanoRandomRounds: 2,
        players: [
          { name: 'Alice Brown' },
          { name: 'Bob Wilson' },
          { name: 'Carl White' },
          { name: 'Dana Black' }
        ],
        matches: [
          { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 5 },
          { team1: [0, 2], team2: [1, 3], isFinished: true, winner: 1, scoreDelta: 3 },
          { team1: [0, 3], team2: [1, 2], isFinished: false } // in-progress
        ]
      } as any,
      {
        id: '3',
        version: 1,
        name: 'Spring Americano',
        createdAt: new Date('2024-03-10').toISOString(),
        format: 'americano',
        pointsPerGame: 24,
        numberOfCourts: 2,
        isFixedPairs: false,
        playerCount: 4,
        players: [
          { name: 'Charlie Davis' },
          { name: 'Diana Miller' },
          { name: 'Ethan Hunt' },
          { name: 'Fiona Apple' }
        ],
        matches: [
          { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 4 },
          { team1: [0, 2], team2: [1, 3], isFinished: true, winner: 1, scoreDelta: 2 }
        ], // all finished = finished status
        finishedAt: new Date('2024-03-10T15:30:00').getTime()
      } as any,
      {
        id: '4',
        version: 1,
        name: 'Fall Mexicano',
        createdAt: new Date('2024-09-05').toISOString(),
        format: 'mexicano',
        pointsPerGame: 21,
        numberOfCourts: 3,
        isFixedPairs: false,
        playerCount: 4,
        mexicanoMatchupStyle: '1&3vs2&4',
        mexicanoRandomRounds: 1,
        players: [
          { name: 'Eve Thompson' },
          { name: 'Frank White' },
          { name: 'Grace Lee' },
          { name: 'Henry Ford' }
        ],
        matches: [
          { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 6 },
          { team1: [0, 2], team2: [1, 3], isFinished: true, winner: 0, scoreDelta: 4 },
          { team1: [0, 3], team2: [1, 2], isFinished: true, winner: 1, scoreDelta: 3 }
        ], // all finished = finished status
        finishedAt: new Date('2024-09-05T18:45:00').getTime()
      } as any
    ]
    
    describe('format filter', () => {
      it('should filter by americano format', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { format: 'americano' })
        expect(result).toHaveLength(2)
        expect(result.every(t => t.format === 'americano')).toBe(true)
      })
      
      it('should filter by mexicano format', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { format: 'mexicano' })
        expect(result).toHaveLength(2)
        expect(result.every(t => t.format === 'mexicano')).toBe(true)
      })
      
      it('should combine format filter with search query', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, 'summer', { format: 'americano' })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('1')
      })
    })
    
    describe('status filter', () => {
      it('should filter by setup status', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { status: 'setup' })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('1')
        expect(result[0].matches.filter(m => m.isFinished).length).toBe(0)
      })
      
      it('should filter by in-progress status', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { status: 'in-progress' })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('2')
        const finishedMatches = result[0].matches.filter(m => m.isFinished).length
        expect(finishedMatches).toBeGreaterThan(0)
        expect(finishedMatches).toBeLessThan(result[0].matches.length)
      })
      
      it('should filter by finished status', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { status: 'finished' })
        expect(result).toHaveLength(2)
        expect(result.every(t => t.matches.every(m => m.isFinished))).toBe(true)
      })
      
      it('should combine status filter with search query', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, 'americano', { status: 'finished' })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('3')
      })
    })
    
    describe('date range filter', () => {
      it('should filter by dateFrom (inclusive)', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { 
          dateFrom: new Date('2024-06-15') 
        })
        expect(result).toHaveLength(3)
        expect(result.map(t => t.id).sort()).toEqual(['1', '2', '4'])
      })
      
      it('should filter by dateTo (inclusive)', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { 
          dateTo: new Date('2024-06-15') 
        })
        expect(result).toHaveLength(2)
        expect(result.map(t => t.id).sort()).toEqual(['1', '3'])
      })
      
      it('should filter by date range (both inclusive)', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { 
          dateFrom: new Date('2024-06-01'),
          dateTo: new Date('2024-09-30')
        })
        expect(result).toHaveLength(2)
        expect(result.map(t => t.id).sort()).toEqual(['1', '4'])
      })
      
      it('should combine date filter with search query', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, 'mexicano', { 
          dateFrom: new Date('2024-09-01')
        })
        expect(result).toHaveLength(2)
        expect(result.every(t => t.format === 'mexicano')).toBe(true)
      })
    })
    
    describe('combined filters', () => {
      it('should apply format and status filters together', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { 
          format: 'americano',
          status: 'finished'
        })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('3')
      })
      
      it('should apply all filters together', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, 'mexicano', { 
          format: 'mexicano',
          status: 'finished',
          dateFrom: new Date('2024-09-01')
        })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('4')
      })
      
      it('should return empty array when no matches found', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, '', { 
          format: 'americano',
          status: 'in-progress'
        })
        expect(result).toHaveLength(0)
      })
      
      it('should work with search text and multiple filters', () => {
        const result = filterTournamentsBySearch(filterTestTournaments, 'john', { 
          format: 'americano',
          status: 'setup',
          dateFrom: new Date('2024-06-01'),
          dateTo: new Date('2024-06-30')
        })
        expect(result).toHaveLength(1)
        expect(result[0].id).toBe('1')
      })
    })
  })
})

describe('getTournamentStatus', () => {
  it('should return setup for tournament at round 0', () => {
    const tournament: StoredTournament = {
      id: '1',
      version: 1,
      name: 'Test',
      format: 'americano',
      pointsPerGame: 21,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
      matches: []
    }
    expect(getTournamentStatus(tournament)).toBe('setup')
  })
  
  it('should return in-progress for tournament in middle rounds', () => {
    const tournament: StoredTournament = {
      id: '1',
      version: 1,
      name: 'Test',
      format: 'americano',
      pointsPerGame: 21,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
      matches: [
        { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 5 },
        { team1: [0, 2], team2: [1, 3], isFinished: false }
      ]
    }
    expect(getTournamentStatus(tournament)).toBe('in-progress')
  })
  
  it('should return finished for tournament at final round', () => {
    const tournament: StoredTournament = {
      id: '1',
      version: 1,
      name: 'Test',
      format: 'americano',
      pointsPerGame: 21,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
      matches: [
        { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 5 },
        { team1: [0, 2], team2: [1, 3], isFinished: true, winner: 1, scoreDelta: 3 }
      ],
      finishedAt: Date.now()
    }
    expect(getTournamentStatus(tournament)).toBe('finished')
  })
  
  it('should return finished for tournament past final round', () => {
    const tournament: StoredTournament = {
      id: '1',
      version: 1,
      name: 'Test',
      format: 'americano',
      pointsPerGame: 21,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
      matches: [
        { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 5 },
        { team1: [0, 2], team2: [1, 3], isFinished: true, winner: 1, scoreDelta: 3 },
        { team1: [0, 3], team2: [1, 2], isFinished: true, winner: 0, scoreDelta: 4 }
      ],
      finishedAt: Date.now()
    }
    expect(getTournamentStatus(tournament)).toBe('finished')
  })
  
  it('should return in-progress for tournament at round 1', () => {
    const tournament: StoredTournament = {
      id: '1',
      version: 1,
      name: 'Test',
      format: 'americano',
      pointsPerGame: 21,
      numberOfCourts: 2,
      isFixedPairs: false,
      playerCount: 4,
      players: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
      matches: [
        { team1: [0, 1], team2: [2, 3], isFinished: true, winner: 0, scoreDelta: 5 },
        { team1: [0, 2], team2: [1, 3], isFinished: false }
      ]
    }
    expect(getTournamentStatus(tournament)).toBe('in-progress')
  })
})
