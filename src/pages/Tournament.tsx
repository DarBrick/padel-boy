import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Share2, Download, LoaderCircle, QrCode } from 'lucide-react'
import { useTournaments } from '../stores/tournaments'
import { isTournamentFinished as checkIsTournamentFinished } from '../utils/tournamentState'
import { shareTournament } from '../utils/shareHelper'
import { exportTournamentResultsPdf } from '../utils/pdfExport'
import { getTournamentQrAvailability } from '../utils/qrExport'
import { ContentPanel } from '../components/ui'
import { TournamentResults, ActiveTournament, TournamentQrModal } from '../components/tournament'
import { IconButton } from '../components/ui'

export function Tournament() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { getTournament } = useTournaments()
  const [isSharing, setIsSharing] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  
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
          : t('shared.alreadySaved'),
        { id: 'shared-link-import-result' }
      )

      // Clear navigation state to prevent re-showing on refresh/navigation
      navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
    }
  }, [location.pathname, location.search, location.state, navigate, t])

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
          <p className="text-foreground-muted">{t('tournament.notFoundDesc')}</p>
        </ContentPanel>
      </div>
    )
  }

  const isTournamentFinished = checkIsTournamentFinished(tournament)
  const qrAvailability = getTournamentQrAvailability(tournament)

  const handleExportPdf = async () => {
    if (!tournament || !isTournamentFinished || isExportingPdf) return

    setIsExportingPdf(true)
    try {
      await exportTournamentResultsPdf({
        tournament,
        locale: i18n.language,
        t,
      })
      toast.success(t('results.export.success'))
    } catch (error) {
      toast.error(t('results.export.error'))
    } finally {
      setIsExportingPdf(false)
    }
  }

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
          disabled={isSharing}
          icon={Share2}
          label={t('pastTournaments.actions.share')}
        />
        {qrAvailability.isAvailable && (
          <IconButton
            onClick={() => setIsQrModalOpen(true)}
            icon={QrCode}
            label={t('shared.qr.button')}
          />
        )}
        {isTournamentFinished && (
          <IconButton
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            icon={isExportingPdf ? <LoaderCircle className="w-6 h-6 text-foreground-muted animate-spin" /> : Download}
            label={isExportingPdf ? t('results.export.loading') : t('results.export.label')}
          />
        )}
      </div>

      {/* Tournament content */}
      {isTournamentFinished ? (
        <TournamentResults tournament={tournament} />
      ) : (
        <ActiveTournament initialTournament={tournament} />
      )}

      {isQrModalOpen && (
        <TournamentQrModal
          tournament={tournament}
          onClose={() => setIsQrModalOpen(false)}
        />
      )}
    </div>
  )
}

