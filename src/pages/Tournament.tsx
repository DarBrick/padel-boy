import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Share2 } from 'lucide-react'
import { useTournaments } from '../stores/tournaments'
import { isTournamentFinished as checkIsTournamentFinished } from '../utils/tournamentState'
import { shareTournament } from '../utils/shareHelper'
import { ContentPanel } from '../components/ContentPanel'
import { TournamentResults } from '../components/TournamentResults'
import { ActiveTournament } from '../components/ActiveTournament'
import { IconButton } from '../components/IconButton'

export function Tournament() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { getTournament } = useTournaments()
  const [isSharing, setIsSharing] = useState(false)
  
  const tournament = getTournament(id!)
  
  // Show back button if user has history to go back to
  const showBackButton = window.history.length > 1

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

  // Handle back navigation
  const handleBack = () => {
    navigate(-1)
  }

  // Handle share tournament
  const handleShare = async () => {
    if (!tournament || isSharing) return

    setIsSharing(true)
    try {
      const result = await shareTournament(tournament, t)
      if (result.success && result.method !== 'share') {
        toast.success(t('shared.copySuccess'))
      } else if (!result.success) {
        toast.error(t('shared.shareError'))
      }
    } catch (error) {
      toast.error(t('shared.shareError'))
    } finally {
      setIsSharing(false)
    }
  }

  // Handle tournament not found
  if (!tournament) {
    return (
      <div className="space-y-6 sm:space-y-7 md:space-y-8">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          {showBackButton && (
            <IconButton
              onClick={handleBack}
              icon={ArrowLeft}
              label={t('tournament.back')}
            />
          )}
        </div>
        
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

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        {showBackButton && (
          <IconButton
            onClick={handleBack}
            icon={ArrowLeft}
            label={t('tournament.back')}
          />
        )}
        <IconButton
          onClick={handleShare}
          icon={Share2}
          label={t('pastTournaments.actions.share')}
        />
      </div>

      {/* Tournament content */}
      {isTournamentFinished ? (
        <TournamentResults tournament={tournament} />
      ) : (
        <ActiveTournament initialTournament={tournament} />
      )}
    </div>
  )
}

