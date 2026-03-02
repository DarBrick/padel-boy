import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { LanguageSwitcher } from '../components/layout';

export function Settings() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.settings')}</h1>
        <p className="text-foreground-muted">{t('settings.description')}</p>
      </div>

      {/* Language Section */}
      <div className="bg-surface/60 rounded-lg p-4 sm:p-5 md:p-6 border border-border/70">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-padel-500" />
          <h2 className="text-xl font-semibold">{t('settings.language')}</h2>
        </div>
        <LanguageSwitcher />
      </div>
    </div>
  );
}
