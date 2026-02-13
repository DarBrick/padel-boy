import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useTournaments } from '../stores/tournaments'
import { isTournamentFinished as checkIsTournamentFinished } from '../utils/tournamentState'
import { ContentPanel } from '../components/ContentPanel'
import { TournamentResults } from '../components/TournamentResults'
import { ActiveTournament } from '../components/ActiveTournament'

export function Tournament() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { getTournament } = useTournaments()
  
  const tournament = getTournament(id!)

  // Show toast notification if arriving from shared link
  useEffect(() => {
    const state = location.state as { fromSharedLink?: boolean; isNew?: boolean } | null
    if (state?.fromSharedLink) {
      toast.success(
        state.isNew 
          ? t('shared.savedNotification')
          : t('shared.alreadySaved')
      )
      // Clear state to prevent showing toast on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location, t])

  // Handle tournament not found
  if (!tournament) {
    return (
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{t('tournament.notFound')}</h1>
        </div>
        <ContentPanel>
          <p className="text-slate-400">{t('tournament.notFoundDesc')}</p>
        </ContentPanel>
      </div>
    )
  }

  const isTournamentFinished = checkIsTournamentFinished(tournament)

  // If tournament is finished, show results view
  if (isTournamentFinished) {
    return <TournamentResults tournament={tournament} />
  }

  // Otherwise show active tournament view
  return <ActiveTournament initialTournament={tournament} />
}

