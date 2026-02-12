import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { useTournaments } from '../stores/tournaments'
import { isTournamentFinished as checkIsTournamentFinished } from '../utils/tournamentState'
import { IconButton } from '../components/IconButton'
import { ContentPanel } from '../components/ContentPanel'
import { TournamentResults } from '../components/TournamentResults'
import { ActiveTournament } from '../components/ActiveTournament'

export function Tournament() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getTournament } = useTournaments()
  
  const tournament = getTournament(id!)

  // Handle tournament not found
  if (!tournament) {
    return (
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        <div>
          <div className="flex items-center gap-4">
            <IconButton onClick={() => navigate('/')} label={t('tournament.backToHome')} />
            <h1 className="text-3xl font-bold">{t('tournament.notFound')}</h1>
          </div>
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

