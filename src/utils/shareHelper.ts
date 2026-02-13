import type { TFunction } from 'i18next'
import type { StoredTournament } from '../schemas/tournament'
import { encodeTournament, encodeBase64Url } from './binaryFormat'

export type ShareResult = {
  success: boolean
  method: 'share' | 'clipboard' | 'fallback'
  error?: Error
}

/**
 * Detects if the device is mobile based on touch support and screen size
 */
function isMobileDevice(): boolean {
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const isSmallScreen = window.innerWidth < 1024
  return hasTouchScreen && isSmallScreen
}

/**
 * Shares a tournament via native share API (mobile) or copies URL to clipboard (desktop)
 * @param tournament - The tournament to share
 * @param t - i18next translation function
 * @returns Promise that resolves with share result status
 */
export async function shareTournament(tournament: StoredTournament, t: TFunction): Promise<ShareResult> {
  try {
    const encoded = encodeTournament(tournament)
    const base64url = encodeBase64Url(encoded)
    
    // Get base URL from current location (handles both local and GitHub Pages)
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/(tournament|shared|past)\/.*$/, '')
    const url = `${baseUrl}/shared/${base64url}`
    
    // Try native share API only on mobile devices
    if (isMobileDevice() && navigator.share) {
      try {
        const formatName = tournament.format === 'americano' ? 'Americano' : 'Mexicano'
        await navigator.share({
          title: tournament.name || t('tournament.title'),
          text: t('shared.shareMessage', { 
            tournamentName: tournament.name || t('tournament.title'),
            players: tournament.playerCount,
            format: formatName
          }),
          url: url,
        })
        return { success: true, method: 'share' }
      } catch (shareError) {
        // User cancelled share dialog or share failed
        if ((shareError as Error).name !== 'AbortError') {
          console.error('Share failed:', shareError)
        }
        // Fall through to clipboard copy
      }
    }
    
    // Fallback: copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url)
      return { success: true, method: 'clipboard' }
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return { success: true, method: 'fallback' }
    }
  } catch (error) {
    console.error('Failed to share tournament:', error)
    return { 
      success: false, 
      method: 'clipboard',
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}
