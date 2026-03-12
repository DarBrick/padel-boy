import { useTranslation } from 'react-i18next';
import { Globe, SlidersHorizontal, Trophy, Shuffle, Dices, LayoutGrid, Grid2X2Plus, Sparkles } from 'lucide-react';
import { LanguageSwitcher } from '../components/layout';
import { ContentPanel, CourtChip, RadioCardGroup, SliderInput } from '../components/ui';
import { useCreateDefaults } from '../stores/createDefaults';

export function Settings() {
  const { t } = useTranslation();
  const {
    defaultEventType,
    defaultPointsPerMatch,
    defaultMexicanoMatchupStyle,
    defaultMexicanoRandomRounds,
    defaultCourtNames,
    setDefaultEventType,
    setDefaultPointsPerMatch,
    setDefaultMexicanoMatchupStyle,
    setDefaultMexicanoRandomRounds,
    setDefaultCourtName,
    addDefaultCourtName,
    removeDefaultCourtName,
  } = useCreateDefaults();

  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">{t('nav.settings')}</h1>
        <p className="text-foreground-muted">{t('settings.description')}</p>
      </div>

      {/* Language Section */}
      <div className="bg-surface/60 rounded-lg p-4 sm:p-5 md:p-6 border border-border/70">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-padel-500" />
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{t('settings.language')}</h2>
        </div>
        <LanguageSwitcher />
      </div>

      <ContentPanel>
        <div className="flex items-center gap-3 mb-2">
          <SlidersHorizontal className="w-5 h-5 text-padel-500" />
          <h2 className="text-xl font-semibold text-foreground sm:text-2xl">{t('settings.createDefaults.title')}</h2>
        </div>
        <p className="text-foreground-muted text-sm mb-4">{t('settings.createDefaults.description')}</p>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <div>
            <label className="mb-3 block text-base font-semibold text-foreground sm:text-lg">
              <Sparkles className="w-5 h-5 inline-block mr-2" />
              {t('create.eventType.label')}
            </label>
            <RadioCardGroup
              name="settings-default-event-type"
              options={[
                { value: 'americano', label: 'Americano', description: t('create.eventType.americanoDesc') },
                { value: 'mexicano', label: 'Mexicano', description: t('create.eventType.mexicanoDesc') },
              ]}
              value={defaultEventType}
              onChange={(value) => setDefaultEventType(value as 'americano' | 'mexicano')}
            />
          </div>

          <div>
            <label className="mb-3 block text-base font-semibold text-foreground sm:text-lg">
              <Trophy className="w-5 h-5 inline-block mr-2" />
              {t('settings.createDefaults.points')}
            </label>
            <RadioCardGroup
              name="settings-default-points"
              options={[
                { value: '16', label: '16' },
                { value: '21', label: '21' },
                { value: '24', label: '24' },
                { value: '32', label: '32' },
              ]}
              value={defaultPointsPerMatch}
              onChange={(value) => setDefaultPointsPerMatch(value as '16' | '21' | '24' | '32')}
            />
          </div>

          <div>
            <label className="mb-3 block text-base font-semibold text-foreground sm:text-lg">
              <Shuffle className="w-5 h-5 inline-block mr-2" />
              {t('settings.createDefaults.matchupStyle')}
            </label>
            <RadioCardGroup
              name="settings-default-matchup-style"
              options={[
                { value: '1&4vs2&3', label: t('create.mexicano.matchup.desc1') },
                { value: '1&3vs2&4', label: t('create.mexicano.matchup.desc2') },
              ]}
              value={defaultMexicanoMatchupStyle}
              onChange={(value) => setDefaultMexicanoMatchupStyle(value as '1&4vs2&3' | '1&3vs2&4')}
            />
          </div>

          <div>
            <label className="mb-3 block text-base font-semibold text-foreground sm:text-lg">
              <Dices className="w-5 h-5 inline-block mr-2" />
              {t('settings.createDefaults.randomRounds')}
            </label>
            <SliderInput
              min={1}
              max={5}
              value={defaultMexicanoRandomRounds}
              onChange={setDefaultMexicanoRandomRounds}
            />
          </div>

          <div>
            <label className="mb-3 block text-base font-semibold text-foreground sm:text-lg">
              <LayoutGrid className="w-5 h-5 inline-block mr-2" />
              {t('settings.createDefaults.courtNames')}
            </label>
            <p className="text-foreground-muted text-sm mb-3">{t('settings.createDefaults.courtNamesHint')}</p>

            {defaultCourtNames.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {defaultCourtNames.map((name, index) => (
                    <CourtChip
                      key={index}
                      name={name}
                      index={index}
                      onRename={(newName) => setDefaultCourtName(index, newName)}
                      onDelete={() => removeDefaultCourtName(index)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addDefaultCourtName}
                  disabled={defaultCourtNames.length >= 10}
                  className="flex items-center gap-2 px-5 py-2.5 sm:py-2.5 md:py-3 text-base text-foreground-muted hover:text-padel-500 border border-dashed border-border hover:border-padel-500/50 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-foreground-muted disabled:hover:border-border"
                >
                  <Grid2X2Plus className="w-5 h-5" />
                  {t('settings.createDefaults.addCourtName')}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground-muted text-sm">{t('settings.createDefaults.courtNamesEmpty')}</p>
                <button
                  type="button"
                  onClick={addDefaultCourtName}
                  className="flex items-center gap-2 px-5 py-2.5 sm:py-2.5 md:py-3 text-base text-foreground-muted hover:text-padel-500 border border-dashed border-border hover:border-padel-500/50 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
                >
                  <Grid2X2Plus className="w-5 h-5" />
                  {t('settings.createDefaults.addCourtName')}
                </button>
              </div>
            )}
          </div>
        </div>
      </ContentPanel>
    </div>
  );
}
