import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Download, LoaderCircle, QrCode, X } from 'lucide-react'
import type { StoredTournament } from '../../schemas/tournament'
import { generateTournamentQrDataUrlForTournament, getTournamentQrAvailability } from '../../utils/qrExport'

interface TournamentQrModalProps {
  tournament: StoredTournament
  onClose: () => void
}

function sanitizeFilenameSegment(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()

  return normalized || 'tournament'
}

export function TournamentQrModal({ tournament, onClose }: TournamentQrModalProps) {
  const { t } = useTranslation()
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)
  const availability = getTournamentQrAvailability(tournament)

  useEffect(() => {
    let isActive = true

    setQrDataUrl(null)
    setHasError(false)

    if (!availability.isAvailable) {
      setHasError(true)
      return () => {
        isActive = false
      }
    }

    generateTournamentQrDataUrlForTournament(tournament)
      .then((dataUrl) => {
        if (isActive) {
          setQrDataUrl(dataUrl)
        }
      })
      .catch((error) => {
        console.error('Failed to generate tournament QR code:', error)
        if (isActive) {
          setHasError(true)
        }
      })

    return () => {
      isActive = false
    }
  }, [availability.isAvailable, tournament])

  const handleExportImage = async () => {
    if (!qrDataUrl) {
      return
    }

    try {
      const link = document.createElement('a')
      const tournamentName = tournament.name?.trim() || t('results.export.fileNameFallback')
      link.href = qrDataUrl
      link.download = `${sanitizeFilenameSegment(tournamentName)}-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(t('shared.qr.exportSuccess'))
    } catch (error) {
      toast.error(t('shared.qr.exportError'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl border border-border bg-background-elevated p-4 shadow-2xl sm:p-5 md:p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface hover:text-foreground"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div className="pt-4 text-center sm:pt-2">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-padel-500/10 text-padel-500">
              <QrCode className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-foreground">{t('shared.qr.title')}</h3>
            <p className="mt-2 text-sm text-foreground-muted">{t('shared.qr.description')}</p>
          </div>

          <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white p-4 shadow-inner">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={t('shared.qr.imageAlt', { tournamentName: tournament.name || t('tournament.title') })}
                className="h-full w-full max-w-[320px]"
              />
            ) : hasError ? (
              <div className="space-y-3 text-center text-slate-700">
                <QrCode className="mx-auto h-10 w-10 text-slate-500" />
                <p className="text-sm">{t('shared.qr.error')}</p>
              </div>
            ) : (
              <div className="space-y-3 text-center text-slate-700">
                <LoaderCircle className="mx-auto h-10 w-10 animate-spin text-slate-500" />
                <p className="text-sm">{t('shared.qr.loading')}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleExportImage}
              disabled={!qrDataUrl}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-padel-500 px-4 py-3 font-medium text-background transition-colors hover:bg-padel-400 disabled:cursor-not-allowed disabled:bg-slate-500"
            >
              <Download className="h-4 w-4" />
              {t('shared.qr.exportImage')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] flex-1 rounded-lg bg-surface px-4 py-3 font-medium text-foreground transition-colors hover:bg-surface-muted"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}