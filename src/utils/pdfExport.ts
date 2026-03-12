import type { TFunction } from 'i18next'
import type { UserOptions } from 'jspdf-autotable'
import type { StoredMatch, StoredTournament } from '../schemas/tournament'
import dejavuSansBoldFontUrl from 'dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf?url'
import dejavuSansFontUrl from 'dejavu-fonts-ttf/ttf/DejaVuSans.ttf?url'
import { generateTournamentQrDataUrl, getTournamentQrAvailability } from './qrExport'
import { getPausingPlayers, getRoundMatches, getTotalRounds } from './tournamentState'
import { getTournamentStats } from './tournamentStats'

const PDF_FONT_FAMILY = 'DejaVuSans'
const PDF_FONT_REGULAR_FILE = 'DejaVuSans.ttf'
const PDF_FONT_BOLD_FILE = 'DejaVuSans-Bold.ttf'

interface JsPdfDocument {
  internal: {
    pageSize: {
      getWidth: () => number
      getHeight: () => number
    }
  }
  setProperties: (properties: Record<string, string>) => void
  setFont: (fontName: string, fontStyle?: string) => void
  setFontSize: (size: number) => void
  setTextColor: (r: number, g: number, b: number) => void
  text: (text: string | string[], x: number, y: number, options?: { align?: 'left' | 'center' | 'right' }) => void
  splitTextToSize: (text: string, maxWidth: number) => string[]
  addPage: () => void
  addImage: (imageData: string, format: string, x: number, y: number, width: number, height: number) => void
  addFileToVFS: (filename: string, data: string) => void
  addFont: (postScriptName: string, id: string, fontStyle: string, fontWeight?: string | number) => void
  save: (filename: string) => void
  lastAutoTable?: {
    finalY: number
  }
}

interface AutoTableModule {
  default: (doc: JsPdfDocument, options: UserOptions) => void
}

export interface TournamentResultsPdfRoundMatch {
  team1: string
  score: string
  team2: string
}

export interface TournamentResultsPdfRoundSection {
  roundNumber: number
  matches: TournamentResultsPdfRoundMatch[]
  pausingPlayers: string[]
}

export interface TournamentResultsPdfData {
  title: string
  filename: string
  summaryRows: Array<[string, string]>
  standingsRows: string[][]
  rounds: TournamentResultsPdfRoundSection[]
}

interface BuildTournamentResultsPdfDataOptions {
  locale: string
  t: TFunction
}

interface ExportTournamentResultsPdfOptions extends BuildTournamentResultsPdfDataOptions {
  tournament: StoredTournament
}

let pdfFontDataPromise: Promise<{ regular: string; bold: string }> | null = null

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = ''

  for (let index = 0; index < bytes.length; index += 0x8000) {
    const chunk = bytes.subarray(index, index + 0x8000)
    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}

async function loadPdfFontData(): Promise<{ regular: string; bold: string }> {
  if (!pdfFontDataPromise) {
    pdfFontDataPromise = Promise.all([
      fetch(dejavuSansFontUrl),
      fetch(dejavuSansBoldFontUrl),
    ]).then(async ([regularResponse, boldResponse]) => {
      if (!regularResponse.ok || !boldResponse.ok) {
        throw new Error('Failed to load PDF font assets')
      }

      const [regularBuffer, boldBuffer] = await Promise.all([
        regularResponse.arrayBuffer(),
        boldResponse.arrayBuffer(),
      ])

      return {
        regular: uint8ArrayToBase64(new Uint8Array(regularBuffer)),
        bold: uint8ArrayToBase64(new Uint8Array(boldBuffer)),
      }
    })
  }

  return pdfFontDataPromise
}

async function registerPdfFonts(doc: JsPdfDocument): Promise<void> {
  const { regular, bold } = await loadPdfFontData()

  doc.addFileToVFS(PDF_FONT_REGULAR_FILE, regular)
  doc.addFont(PDF_FONT_REGULAR_FILE, PDF_FONT_FAMILY, 'normal')
  doc.addFileToVFS(PDF_FONT_BOLD_FILE, bold)
  doc.addFont(PDF_FONT_BOLD_FILE, PDF_FONT_FAMILY, 'bold')
}

function getFinishedDate(tournament: StoredTournament, locale: string): string {
  const timestamp = tournament.finishedAt ?? Date.now()

  return new Date(timestamp).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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

function getPdfFilename(tournament: StoredTournament, locale: string, t: TFunction): string {
  const fallbackName = t('results.export.fileNameFallback')
  const tournamentName = tournament.name?.trim() || fallbackName
  const timestamp = tournament.finishedAt ?? Date.now()
  const dateSegment = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(timestamp)
    .replace(/[^0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${sanitizeFilenameSegment(tournamentName)}-${dateSegment || 'results'}.pdf`
}

function getFormatLabel(tournament: StoredTournament, t: TFunction): string {
  return tournament.format === 'americano'
    ? t('tournament.format.americano')
    : t('tournament.format.mexicano')
}

function formatSignedBalance(value: number): string {
  if (value > 0) return `+${value}`
  return `${value}`
}

function getMatchScore(tournament: StoredTournament, match: StoredMatch): string {
  if (!match.isFinished || match.winner === undefined || match.scoreDelta === undefined) {
    return '— : —'
  }

  const winningScore = Math.floor((tournament.pointsPerGame + match.scoreDelta) / 2)
  const losingScore = Math.floor((tournament.pointsPerGame - match.scoreDelta) / 2)
  const score1 = match.winner === 0 ? winningScore : losingScore
  const score2 = match.winner === 1 ? winningScore : losingScore

  return `${score1} : ${score2}`
}

export function buildTournamentResultsPdfData(
  tournament: StoredTournament,
  { locale, t }: BuildTournamentResultsPdfDataOptions,
): TournamentResultsPdfData {
  const stats = getTournamentStats(tournament)
  const title = tournament.name?.trim() || t('tournament.title')
  const summaryRows: Array<[string, string]> = [
    [t('results.export.summary.format'), getFormatLabel(tournament, t)],
    [t('results.export.summary.players'), String(tournament.playerCount)],
    [t('results.export.summary.finishedAt'), getFinishedDate(tournament, locale)],
    [t('results.export.summary.rounds'), String(stats.totalRounds)],
    [t('results.export.summary.matches'), `${stats.finishedMatches}/${stats.totalMatches}`],
  ]

  if (tournament.format === 'mexicano' && tournament.mexicanoMatchupStyle) {
    summaryRows.push([t('results.export.summary.pairingStyle'), tournament.mexicanoMatchupStyle])
  }

  if (tournament.format === 'mexicano' && tournament.mexicanoRandomRounds) {
    summaryRows.push([t('results.export.summary.randomRounds'), String(tournament.mexicanoRandomRounds)])
  }

  if (tournament.isFixedPairs) {
    summaryRows.push([t('results.export.summary.fixedPairs'), t('common.yes')])
  }

  const standingsRows = stats.standings.map((standing) => [
    String(standing.rank),
    standing.name,
    `${standing.wins}/${standing.draws}/${standing.losses}`,
    `${(standing.winRate * 100).toFixed(0)}%`,
    String(standing.totalPointsWithSitting),
    formatSignedBalance(standing.balance),
    standing.pointsPerGame.toFixed(1),
  ])

  const totalRounds = getTotalRounds(tournament)
  const rounds = Array.from({ length: totalRounds }, (_, index) => index + 1).map((roundNumber) => {
    const matches = getRoundMatches(tournament, roundNumber).map((match) => ({
      team1: match.team1.map((playerIndex) => tournament.players[playerIndex].name).join(' / '),
      score: getMatchScore(tournament, match),
      team2: match.team2.map((playerIndex) => tournament.players[playerIndex].name).join(' / '),
    }))
    const pausingPlayers = getPausingPlayers(tournament, roundNumber).map(
      (playerIndex) => tournament.players[playerIndex].name,
    )

    return {
      roundNumber,
      matches,
      pausingPlayers,
    }
  })

  return {
    title,
    filename: getPdfFilename(tournament, locale, t),
    summaryRows,
    standingsRows,
    rounds,
  }
}

function addSectionHeading(doc: JsPdfDocument, title: string, y: number): number {
  doc.setFont(PDF_FONT_FAMILY, 'bold')
  doc.setFontSize(13)
  doc.setTextColor(20, 24, 38)
  doc.text(title, 40, y)
  return y + 12
}

function ensurePageSpace(doc: JsPdfDocument, y: number, neededHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y + neededHeight <= pageHeight - 40) {
    return y
  }

  doc.addPage()
  return 40
}

export async function exportTournamentResultsPdf({
  tournament,
  locale,
  t,
}: ExportTournamentResultsPdfOptions): Promise<string> {
  const pdfData = buildTournamentResultsPdfData(tournament, { locale, t })
  const qrAvailability = getTournamentQrAvailability(tournament)
  const [{ jsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable') as Promise<AutoTableModule>,
  ])

  const autoTable = autoTableModule.default
  const doc = new jsPDF({ unit: 'pt', format: 'a4' }) as JsPdfDocument
  await registerPdfFonts(doc)
  const pageWidth = doc.internal.pageSize.getWidth()
  let cursorY = 40

  doc.setProperties({
    title: pdfData.title,
    subject: t('results.export.documentSubject'),
    creator: 'Padel Boy',
  })

  doc.setFont(PDF_FONT_FAMILY, 'bold')
  doc.setFontSize(22)
  doc.setTextColor(20, 24, 38)
  doc.text(pdfData.title, pageWidth / 2, cursorY, { align: 'center' })
  cursorY += 22

  doc.setFont(PDF_FONT_FAMILY, 'normal')
  doc.setFontSize(10)
  doc.setTextColor(91, 102, 121)
  const subtitleLines = doc.splitTextToSize(t('results.export.generatedWithDate', { date: getFinishedDate(tournament, locale) }), pageWidth - 80)
  doc.text(subtitleLines, pageWidth / 2, cursorY, { align: 'center' })
  cursorY += subtitleLines.length * 12 + 16

  cursorY = addSectionHeading(doc, t('results.export.sections.summary'), cursorY)
  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    head: [[t('results.export.columns.label'), t('results.export.columns.value')]],
    body: pdfData.summaryRows,
    styles: {
      font: PDF_FONT_FAMILY,
      fontSize: 10,
      cellPadding: 6,
      textColor: [20, 24, 38],
      lineColor: [220, 225, 235],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [28, 37, 54],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 150 },
    },
    margin: { left: 40, right: 40 },
  })
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 24

  cursorY = ensurePageSpace(doc, cursorY, 140)
  cursorY = addSectionHeading(doc, t('standings.title'), cursorY)
  autoTable(doc, {
    startY: cursorY,
    theme: 'grid',
    head: [[
      t('results.standings.rank'),
      t('results.standings.player'),
      t('results.standings.record'),
      t('results.standings.winRate'),
      t('results.standings.totalPoints'),
      t('results.standings.balance'),
      t('results.standings.pointsPerGame'),
    ]],
    body: pdfData.standingsRows,
    styles: {
      font: PDF_FONT_FAMILY,
      fontSize: 9,
      cellPadding: 5,
      textColor: [20, 24, 38],
      lineColor: [220, 225, 235],
      lineWidth: 0.5,
    },
    headStyles: {
      fillColor: [28, 37, 54],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 40, halign: 'center' },
      1: { cellWidth: 140 },
      2: { cellWidth: 70, halign: 'center' },
      3: { cellWidth: 60, halign: 'right' },
      4: { cellWidth: 60, halign: 'right' },
      5: { cellWidth: 55, halign: 'right' },
      6: { cellWidth: 55, halign: 'right' },
    },
    margin: { left: 40, right: 40 },
  })
  cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 24

  for (const round of pdfData.rounds) {
    cursorY = ensurePageSpace(doc, cursorY, 120)
    cursorY = addSectionHeading(doc, t('results.rounds.round', { number: round.roundNumber }), cursorY)
    autoTable(doc, {
      startY: cursorY,
      theme: 'grid',
      head: [[
        t('results.export.columns.team1'),
        t('results.export.columns.score'),
        t('results.export.columns.team2'),
      ]],
      body: round.matches.map((match) => [match.team1, match.score, match.team2]),
      styles: {
        font: PDF_FONT_FAMILY,
        fontSize: 9,
        cellPadding: 5,
        textColor: [20, 24, 38],
        lineColor: [220, 225, 235],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [55, 65, 81],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 210 },
        1: { cellWidth: 64, halign: 'center' },
        2: { cellWidth: 210 },
      },
      margin: { left: 40, right: 40 },
    })
    cursorY = (doc.lastAutoTable?.finalY ?? cursorY) + 10

    if (round.pausingPlayers.length > 0) {
      cursorY = ensurePageSpace(doc, cursorY, 28)
      doc.setFont(PDF_FONT_FAMILY, 'normal')
      doc.setFontSize(10)
      doc.setTextColor(91, 102, 121)
      doc.text(
        `${t('results.rounds.pausing')}: ${round.pausingPlayers.join(', ')}`,
        40,
        cursorY,
      )
      cursorY += 18
    }

    cursorY += 10
  }

  if (qrAvailability.isAvailable) {
    try {
      const qrDataUrl = await generateTournamentQrDataUrl(qrAvailability.shareUrl)
      const qrSize = 220
      const qrX = (pageWidth - qrSize) / 2

      doc.addPage()
      cursorY = 40
      cursorY = addSectionHeading(doc, t('results.export.sections.shareQr'), cursorY)

      doc.addImage(qrDataUrl, 'PNG', qrX, cursorY, qrSize, qrSize)
    } catch (error) {
      console.error('Failed to add tournament QR code to PDF export:', error)
    }
  }

  doc.save(pdfData.filename)
  return pdfData.filename
}