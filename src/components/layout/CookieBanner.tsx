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
      <div className="bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 shadow-2xl">
        <div className="container mx-auto px-4 py-3 sm:py-3.5 md:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Message */}
            <div className="flex-1 pr-8">
              <p className="text-slate-300 text-sm md:text-base flex items-start gap-2">
                <Cookie className="w-5 h-5 flex-shrink-0 mt-0.5 text-[var(--color-padel-yellow)]" />
                <span>
                  {t('cookieBanner.message')}{' '}
                  <button
                    onClick={handlePrivacyClick}
                    className="text-[var(--color-padel-yellow)] underline hover:text-[#C5F000] transition-colors"
                  >
                    {t('privacy.title')}
                  </button>
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto">
              <button
                onClick={dismissBanner}
                className="max-w-[200px] flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-blue-600 to-[var(--color-padel-yellow)] hover:from-blue-500 hover:to-[#C5F000] rounded-lg text-white text-sm font-semibold transition-all min-h-[44px]"
              >
                {t('cookieBanner.accept')}
              </button>
              <button
                onClick={dismissBanner}
                className="p-2.5 text-slate-400 hover:text-white transition-colors"
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
