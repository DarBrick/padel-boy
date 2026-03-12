import * as QRCode from 'qrcode'
import type { StoredTournament } from '../schemas/tournament'
import { getTournamentShareUrl } from './shareHelper'

export const MAX_TOURNAMENT_QR_URL_LENGTH = 1800
const QR_CODE_WIDTH = 512

export type TournamentQrAvailability = {
  isAvailable: boolean
  shareUrl: string
  urlLength: number
  maxUrlLength: number
}

export function getTournamentQrAvailability(tournament: StoredTournament): TournamentQrAvailability {
  const shareUrl = getTournamentShareUrl(tournament)

  return {
    isAvailable: shareUrl.length <= MAX_TOURNAMENT_QR_URL_LENGTH,
    shareUrl,
    urlLength: shareUrl.length,
    maxUrlLength: MAX_TOURNAMENT_QR_URL_LENGTH,
  }
}

export async function generateTournamentQrDataUrl(shareUrl: string): Promise<string> {
  if (shareUrl.length > MAX_TOURNAMENT_QR_URL_LENGTH) {
    throw new Error('Tournament QR payload exceeds supported size')
  }

  return QRCode.toDataURL(shareUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: QR_CODE_WIDTH,
    color: {
      dark: '#0f172a',
      light: '#FFFFFF',
    },
  })
}

export async function generateTournamentQrDataUrlForTournament(tournament: StoredTournament): Promise<string> {
  const availability = getTournamentQrAvailability(tournament)

  if (!availability.isAvailable) {
    throw new Error('Tournament QR payload exceeds supported size')
  }

  return generateTournamentQrDataUrl(availability.shareUrl)
}