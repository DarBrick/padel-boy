import { useTranslation } from 'react-i18next';
import { Users } from 'lucide-react';

export function Players() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      <div className="flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-20">
        <Users className="w-16 h-16 md:w-20 md:h-20 text-slate-600 mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('nav.players')}</h1>
        <p className="text-slate-400 text-lg md:text-xl">TBD</p>
      </div>
    </div>
  );
}
