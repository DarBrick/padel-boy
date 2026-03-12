import { Link, useLocation } from 'react-router-dom';
import { Home, Plus, History, Users, Settings, HelpCircle, Menu, X, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { PadelBallIcon } from './PadelBallIcon';
import { useNetworkStatus } from '../../utils/networkStatus';

export function Navbar() {
  const location = useLocation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isOnline = useNetworkStatus();

  const primaryNavItems = [
    { path: '/', label: 'nav.home' as const, icon: Home, exact: true },
    { path: '/create', label: 'nav.create' as const, icon: Plus, exact: false },
    { path: '/past', label: 'nav.history' as const, icon: History, exact: false },
    { path: '/players', label: 'nav.players' as const, icon: Users, exact: false, disabled: true },
  ];

  const secondaryNavItems = [
    { path: '/settings', label: 'nav.settings' as const, icon: Settings, exact: false },
    { path: '/help', label: 'nav.help' as const, icon: HelpCircle, exact: false },
  ];

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const offlineLabel = t('nav.offline');

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + Title */}
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              onClick={handleNavClick}
            >
              <PadelBallIcon className="w-8 h-8" animate={false} />
              <span className="text-xl font-bold">
                {t('appName')}
              </span>
            </Link>

            {/* Desktop: Nav Items */}
            <div className="hidden md:flex items-center gap-2">
              {[...primaryNavItems, ...secondaryNavItems].map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                const disabled = 'disabled' in item && item.disabled;
                
                if (disabled) {
                  return (
                    <button
                      key={item.path}
                      disabled
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-foreground-muted cursor-not-allowed opacity-50"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{t(item.label)}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
                      active
                        ? 'text-padel-500 bg-surface/70'
                        : 'text-foreground-muted hover:text-foreground hover:bg-surface/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{t(item.label)}</span>
                  </Link>
                );
              })}

              {!isOnline && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-rose-400 bg-rose-500/10"
                  aria-label={offlineLabel}
                  title={offlineLabel}
                >
                  <WifiOff className="w-4 h-4" />
                  <span className="font-medium">{offlineLabel}</span>
                </span>
              )}
            </div>

            <div className="md:hidden flex items-center gap-1.5">
              {!isOnline && (
                <span
                  className="inline-flex items-center justify-center p-2 rounded-lg text-rose-400 bg-rose-500/10"
                  aria-label={offlineLabel}
                  title={offlineLabel}
                >
                  <WifiOff className="w-5 h-5" />
                </span>
              )}

              {/* Mobile: Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-surface/70 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile: Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-1 border-t border-border/60 bg-background/95 backdrop-blur-sm">
              {/* Primary Nav Items */}
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                const disabled = 'disabled' in item && item.disabled;

                if (disabled) {
                  return (
                    <button
                      key={item.path}
                      disabled
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground-muted cursor-not-allowed opacity-50 w-full"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{t(item.label)}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'text-padel-500 bg-surface/70'
                        : 'text-foreground-muted hover:text-foreground hover:bg-surface/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{t(item.label)}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="border-t border-border/60 my-2" />

              {/* Secondary Nav Items */}
              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      active
                        ? 'text-padel-500 bg-surface/70'
                        : 'text-foreground-muted hover:text-foreground hover:bg-surface/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{t(item.label)}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Backdrop - rendered outside nav to properly cover content */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
