import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CookieConsentState {
  bannerDismissed: boolean
  dismissBanner: () => void
}

export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set) => ({
      bannerDismissed: false,
      dismissBanner: () => set({ bannerDismissed: true }),
    }),
    {
      name: 'cookie-consent',
    }
  )
)
