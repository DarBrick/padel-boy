import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { X, Cookie } from 'lucide-react'
import { useCookieConsent } from '../../stores/cookieConsent'

export function CookieBanner() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { bannerDismissed, dismissBanner } = useCookieConsent()

  if (bannerDismissed) {
    return null
  }

  const handlePrivacyClick = () => {
    navigate('/privacy')
    dismissBanner()
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up">
      <div className="border-t border-border/70 bg-background-elevated/95 shadow-2xl backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 sm:py-5 md:py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Message */}
            <div className="flex-1 pr-6 sm:pr-8">
              <p className="text-foreground-muted text-sm md:text-base flex items-start gap-2">
                <Cookie className="w-5 h-5 flex-shrink-0 mt-0.5 text-padel-500" />
                <span>
                  {t('cookieBanner.message')}{' '}
                  <button
                    type="button"
                    onClick={handlePrivacyClick}
                    className="text-padel-500 underline transition-colors hover:text-padel-400"
                  >
                    {t('privacy.title')}
                  </button>
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={dismissBanner}
                className="max-w-[200px] flex-1 rounded-lg bg-gradient-to-r from-court-blue to-padel-500 px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:from-court-teal hover:to-padel-400 min-h-[44px] sm:min-h-[46px] md:min-h-[48px] md:flex-none"
              >
                {t('cookieBanner.accept')}
              </button>
              <button
                type="button"
                onClick={dismissBanner}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-surface/70 hover:text-foreground sm:min-h-[46px] sm:min-w-[46px] md:min-h-[48px] md:min-w-[48px]"
                aria-label={t('cookieBanner.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
