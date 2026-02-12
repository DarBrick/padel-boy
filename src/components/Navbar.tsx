import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, History, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PadelBallIcon } from './PadelBallIcon';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: Home, exact: true },
    { path: '/create', label: t('nav.create'), icon: Plus, exact: false },
    { path: '/past', label: t('nav.history'), icon: History, exact: false },
    { path: '/help', label: t('nav.help'), icon: HelpCircle, exact: false },
  ];

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile: Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 md:hidden">
        <div className="flex items-center justify-around px-2 pb-safe">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center min-h-[44px] py-2 px-3 flex-1 transition-colors ${
                  active
                    ? 'text-[var(--color-padel-yellow)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: Top Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Title */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <PadelBallIcon className="w-8 h-8" animate={false} />
              <span className="text-xl font-bold">
                {t('appName')}
              </span>
            </Link>

            {/* Right: Nav Items + Language Switcher */}
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 min-h-[48px] px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'text-[var(--color-padel-yellow)] bg-slate-800/50'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <div className="ml-2 pl-2 border-l border-slate-700/50">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
