import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storedTournamentSchema, type StoredTournament } from '../schemas/tournament'

interface TournamentsState {
  tournaments: StoredTournament[]
  corruptedIds: string[]
  addTournament: (tournament: StoredTournament) => void
  getTournament: (id: string) => StoredTournament | undefined
  deleteTournament: (id: string) => void
  clearAllTournaments: () => void
  removeCorruptedTournaments: () => void
}

export const useTournaments = create<TournamentsState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      corruptedIds: [],
      
      addTournament: (tournament: StoredTournament) => {
        set((state) => ({
          tournaments: [...state.tournaments, tournament],
        }))
      },
      
      getTournament: (id: string) => {
        return get().tournaments.find((t) => t.id === id)
      },
      
      deleteTournament: (id: string) => {
        set((state) => ({
          tournaments: state.tournaments.filter((t) => t.id !== id),
          corruptedIds: state.corruptedIds.filter((cid) => cid !== id),
        }))
      },
      
      clearAllTournaments: () => {
        set({ tournaments: [], corruptedIds: [] })
      },
      
      removeCorruptedTournaments: () => {
        const { tournaments, corruptedIds } = get()
        const cleaned = tournaments.filter((t) => !corruptedIds.includes(t.id))
        set({ tournaments: cleaned, corruptedIds: [] })
      },
    }),
    {
      name: 'tournament-storage',
      // Validate and filter corrupted data on load
      onRehydrateStorage: () => (state) => {
        if (state) {
          const validTournaments: StoredTournament[] = []
          const corruptedIds: string[] = []
          
          state.tournaments.forEach((tournament) => {
            const result = storedTournamentSchema.safeParse(tournament)
            if (result.success) {
              validTournaments.push(result.data)
            } else {
              console.warn('Corrupted tournament detected:', tournament, result.error)
              corruptedIds.push((tournament as any).id || 'unknown')
            }
          })
          
          state.tournaments = validTournaments
          state.corruptedIds = corruptedIds
          
          if (corruptedIds.length > 0) {
            console.warn(`⚠️ ${corruptedIds.length} corrupted tournament(s) detected`)
          }
        }
      },
    }
  )
)
