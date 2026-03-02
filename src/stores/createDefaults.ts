import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CreateTournamentForm } from '../schemas/tournament'

const MAX_COURT_NAMES = 10
const MAX_COURT_NAME_LENGTH = 16

type MatchupStyle = NonNullable<CreateTournamentForm['matchupStyle']>

interface CreateDefaultsState {
  defaultEventType: CreateTournamentForm['eventType']
  defaultPointsPerMatch: CreateTournamentForm['pointsPerMatch']
  defaultMexicanoMatchupStyle: MatchupStyle
  defaultMexicanoRandomRounds: number
  defaultCourtNames: string[]
  setDefaultEventType: (eventType: CreateTournamentForm['eventType']) => void
  setDefaultPointsPerMatch: (points: CreateTournamentForm['pointsPerMatch']) => void
  setDefaultMexicanoMatchupStyle: (style: MatchupStyle) => void
  setDefaultMexicanoRandomRounds: (rounds: number) => void
  setDefaultCourtName: (index: number, name: string) => void
  addDefaultCourtName: () => void
  removeDefaultCourtName: (index: number) => void
}

const sanitizeCourtName = (name: string) => name.trim().slice(0, MAX_COURT_NAME_LENGTH)

const sanitizeCourtNames = (names: string[]) =>
  names.slice(0, MAX_COURT_NAMES).map((name) => sanitizeCourtName(name))

export const useCreateDefaults = create<CreateDefaultsState>()(
  persist(
    (set) => ({
      defaultEventType: 'americano',
      defaultPointsPerMatch: '21',
      defaultMexicanoMatchupStyle: '1&4vs2&3',
      defaultMexicanoRandomRounds: 2,
      defaultCourtNames: [],

      setDefaultEventType: (eventType) => {
        set({ defaultEventType: eventType })
      },

      setDefaultPointsPerMatch: (points) => {
        set({ defaultPointsPerMatch: points })
      },

      setDefaultMexicanoMatchupStyle: (style) => {
        set({ defaultMexicanoMatchupStyle: style })
      },

      setDefaultMexicanoRandomRounds: (rounds) => {
        const normalized = Math.max(1, Math.min(5, rounds))
        set({ defaultMexicanoRandomRounds: normalized })
      },

      setDefaultCourtName: (index, name) => {
        set((state) => {
          if (index < 0 || index >= state.defaultCourtNames.length) {
            return state
          }

          const updated = [...state.defaultCourtNames]
          updated[index] = sanitizeCourtName(name)
          return { defaultCourtNames: updated }
        })
      },

      addDefaultCourtName: () => {
        set((state) => {
          if (state.defaultCourtNames.length >= MAX_COURT_NAMES) {
            return state
          }

          return {
            defaultCourtNames: [...state.defaultCourtNames, ''],
          }
        })
      },

      removeDefaultCourtName: (index) => {
        set((state) => {
          if (index < 0 || index >= state.defaultCourtNames.length) {
            return state
          }

          return {
            defaultCourtNames: state.defaultCourtNames.filter((_, itemIndex) => itemIndex !== index),
          }
        })
      },
    }),
    {
      name: 'create-defaults',
      merge: (persistedState, currentState) => {
        const typed = (persistedState as Partial<CreateDefaultsState> | undefined) ?? {}
        return {
          ...currentState,
          ...typed,
          defaultCourtNames: sanitizeCourtNames(typed.defaultCourtNames ?? currentState.defaultCourtNames),
        }
      },
    }
  )
)
