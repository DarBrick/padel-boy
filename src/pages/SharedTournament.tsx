import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { decodeBase64Url, decodeTournament } from '../utils/binaryFormat'
import { storedTournamentSchema } from '../schemas/tournament'
import { useTournaments } from '../stores/tournaments'
import { TournamentResults } from '../components/TournamentResults'
import { GradientButton } from '../components/GradientButton'
import { ContentPanel } from '../components/ContentPanel'
import type { StoredTournament } from '../schemas/tournament'

type DecodeState = 
  | { status: 'loading' }
  | { status: 'success'; tournament: StoredTournament; isNew: boolean }
  | { status: 'error'; message: string }

export function SharedTournament() {
  const { data } = useParams<{ data: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { addTournamentIfNotExists } = useTournaments()
  
  const [state, setState] = useState<DecodeState>({ status: 'loading' })

  useEffect(() => {
    if (!data) {
      setState({ 
        status: 'error', 
        message: t('shared.error.description') 
      })
      return
    }

    try {
      // Decode base64url → binary → tournament object
      const binaryData = decodeBase64Url(data)
      const decodedTournament = decodeTournament(binaryData)
      
      // Validate with Zod schema
      const result = storedTournamentSchema.safeParse(decodedTournament)
      
      if (!result.success) {
        console.error('Tournament validation failed:', result.error)
        setState({ 
          status: 'error', 
          message: t('shared.error.description') 
        })
        return
      }

      // Auto-save to local storage
      const isNew = addTournamentIfNotExists(result.data)
      
      setState({ 
        status: 'success', 
        tournament: result.data,
        isNew
      })
    } catch (error) {
      console.error('Failed to decode shared tournament:', error)
      setState({ 
        status: 'error', 
        message: t('shared.error.description') 
      })
    }
  }, [data, t, addTournamentIfNotExists])

  // Loading state
  if (state.status === 'loading') {
    return (
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        <ContentPanel>
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-4">
              <div className="w-8 h-8 border-4 border-slate-600 border-t-[var(--color-padel-yellow)] rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('shared.loading')}
            </h2>
          </div>
        </ContentPanel>
      </div>
    )
  }

  // Error state
  if (state.status === 'error') {
    return (
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        <ContentPanel>
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-4">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('shared.error.title')}
            </h2>
            <p className="text-slate-400 text-lg mb-6 max-w-md mx-auto">
              {state.message}
            </p>
            <GradientButton onClick={() => navigate('/')}>
              {t('shared.error.goHome')}
            </GradientButton>
          </div>
        </ContentPanel>
      </div>
    )
  }

  // Success state - render tournament results with notification banner
  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Notification banner */}
      <ContentPanel className="bg-slate-800/50 border-slate-700">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300">
              {state.isNew 
                ? t('shared.savedNotification') 
                : t('shared.alreadySaved')}
            </p>
          </div>
        </div>
      </ContentPanel>

      {/* Tournament results */}
      <TournamentResults tournament={state.tournament} />
    </div>
  )
}
