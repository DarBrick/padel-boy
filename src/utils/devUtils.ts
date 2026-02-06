/**
 * Development utilities for testing and cache management
 * These functions are exposed globally in development mode
 */

import { generateTournamentId } from './tournamentId'
import type { StoredTournament } from '../schemas/tournament'

const PLAYER_NAMES = [
  'Alex', 'Maria', 'Carlos', 'Sofia', 'Diego', 'Emma', 'Luis', 'Ana',
  'Pablo', 'Laura', 'Juan', 'Carmen', 'Miguel', 'Isabel', 'Fernando', 'Elena',
  'Roberto', 'Patricia', 'Antonio', 'Lucia', 'Daniel', 'Marta', 'Jorge', 'Cristina',
  'Ricardo', 'Natalia', 'Javier', 'Adriana', 'Manuel', 'Sara', 'Andres', 'Paula',
]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Generate a random tournament for testing
 * @param date Optional date for the tournament (for testing historical data)
 */
export function generateRandomTournament(date?: Date): StoredTournament {
  const format = Math.random() > 0.5 ? 'americano' : 'mexicano'
  const pointsPerGame = getRandomElement([16, 21, 24, 32] as const)
  const playerCount = Math.floor(Math.random() * 9) * 4 + 4 // 4, 8, 12, 16, 20, 24, 28, 32, 36, 40
  const numberOfCourts = Math.max(1, Math.floor(playerCount / 4))
  
  // Generate random player names
  const shuffledNames = shuffleArray(PLAYER_NAMES)
  const players = shuffledNames
    .slice(0, playerCount)
    .map(name => ({ name }))
  
  // Generate some random matches
  const matchesCount = Math.floor(Math.random() * 5) + 2 // 2-6 matches
  const matches = []

  let isFinished = true;

  for (let i = 0; i < matchesCount; i++) {

    const team1 = [
      Math.floor(Math.random() * playerCount),
      Math.floor(Math.random() * playerCount),
    ] as [number, number]
    const team2 = [
      Math.floor(Math.random() * playerCount),
      Math.floor(Math.random() * playerCount),
    ] as [number, number]
    
    isFinished = Math.random() > 0.1 && isFinished
    
    matches.push({
      team1,
      team2,
      isFinished,
      ...(isFinished && {
        winner: Math.floor(Math.random() * 2) as 0 | 1,
        scoreDelta: Math.floor(Math.random() * (pointsPerGame / 2)),
      }),
    })
  }
  
  const tournament: StoredTournament = {
    version: 1,
    id: generateTournamentId(date),
    name: `Test Tournament ${(date ? date.getTime() : Date.now()).toString(36)}`,
    format,
    pointsPerGame,
    numberOfCourts,
    isFixedPairs: false,
    playerCount,
    players,
    matches,
    ...(format === 'mexicano' && {
      mexicanoMatchupStyle: getRandomElement(['1&4vs2&3', '1&3vs2&4'] as const),
      mexicanoRandomRounds: Math.floor(Math.random() * 5) + 1,
    }),
  }
  
  return tournament
}

/**
 * Add a random tournament to localStorage with optional date
 * Usage in console: devUtils.addRandomTournament()
 * @param date Optional date (defaults to random date within past year)
 */
export function addRandomTournament(date?: Date): void {
  try {
    // Generate random date within past year if not provided
    const tournamentDate = date || new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    const tournament = generateRandomTournament(tournamentDate)
    
    // Get existing tournaments from localStorage
    const storageKey = 'tournament-storage'
    const stored = localStorage.getItem(storageKey)
    const data = stored ? JSON.parse(stored) : { state: { tournaments: [] } }
    
    // Add new tournament
    data.state.tournaments.push(tournament)
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(data))
    
    console.log('✅ Random tournament added:', tournament.name, tournament.id)
    console.log('Tournament details:', tournament)
    console.log('🔄 Refresh the page to see changes')
  } catch (error) {
    console.error('❌ Failed to add random tournament:', error)
  }
}

/**
 * Flush all tournaments from localStorage
 * Usage in console: devUtils.flushTournaments()
 */
export function flushTournaments(): void {
  try {
    const storageKey = 'tournament-storage'
    localStorage.removeItem(storageKey)
    console.log('✅ All tournaments flushed from localStorage')
    console.log('🔄 Refresh the page to see changes')
  } catch (error) {
    console.error('❌ Failed to flush tournaments:', error)
  }
}

/**
 * Add a corrupted tournament for testing error handling
 * Usage in console: devUtils.addCorruptedTournament()
 */
export function addCorruptedTournament(): void {
  try {
    const storageKey = 'tournament-storage'
    const stored = localStorage.getItem(storageKey)
    const data = stored ? JSON.parse(stored) : { state: { tournaments: [] } }
    
    // Add corrupted tournament (missing required fields)
    data.state.tournaments.push({
      id: 'corrupted-' + Date.now(),
      name: 'Corrupted Tournament',
      // Missing required fields to trigger validation error
    })
    
    localStorage.setItem(storageKey, JSON.stringify(data))
    console.log('✅ Corrupted tournament added')
    console.log('🔄 Refresh the page to see error handling')
  } catch (error) {
    console.error('❌ Failed to add corrupted tournament:', error)
  }
}

/**
 * List all tournaments in console
 * Usage in console: devUtils.listTournaments()
 */
export function listTournaments(): void {
  try {
    const storageKey = 'tournament-storage'
    const stored = localStorage.getItem(storageKey)
    const data = stored ? JSON.parse(stored) : { state: { tournaments: [] } }
    
    console.log(`📋 Total tournaments: ${data.state.tournaments.length}`)
    data.state.tournaments.forEach((t: any, index: number) => {
      console.log(`${index + 1}. ${t.name || 'Unnamed'} (${t.id}) - ${t.format} - ${t.playerCount} players`)
    })
  } catch (error) {
    console.error('❌ Failed to list tournaments:', error)
  }
}

/**
 * Add multiple random tournaments at once with varying dates
 * Usage in console: devUtils.addMultipleTournaments(5)
 * @param count Number of tournaments to add (default: 5)
 */
export function addMultipleTournaments(count: number = 5): void {
  console.log(`Adding ${count} random tournaments with varying dates...`)
  for (let i = 0; i < count; i++) {
    // Generate tournaments spread across the past year
    const daysAgo = Math.floor((i / count) * 365)
    const randomHours = Math.random() * 24
    const date = new Date(Date.now() - (daysAgo * 24 + randomHours) * 60 * 60 * 1000)
    addRandomTournament(date)
  }
  console.log(`✅ Added ${count} tournaments`)
  console.log('🔄 Refresh the page to see changes')
}

// Expose dev utils globally in development
if (import.meta.env.DEV) {
  (window as any).devUtils = {
    addRandomTournament,
    flushTournaments,
    addCorruptedTournament,
    listTournaments,
    addMultipleTournaments,
    generateRandomTournament,
  }
  console.log('🛠️  Dev utilities loaded. Type "devUtils" in console to see available commands.')
  console.log('📖 See docs/dev-utils.md for full documentation')
}
