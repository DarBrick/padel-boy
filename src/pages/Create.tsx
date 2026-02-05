import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LayoutGrid, PencilLine, Shuffle, Dices, Trophy, Handshake } from 'lucide-react'
import { useEffect, useState } from 'react'

import { createTournamentSchema, type CreateTournamentForm } from '../schemas/tournament'
import { generateTournamentName } from '../utils/tournament'
import { FormSection } from '../components/FormSection'
import { CollapsiblePanel } from '../components/CollapsiblePanel'
import { SliderInput } from '../components/SliderInput'
import { RadioCardGroup } from '../components/RadioCardGroup'
import { GradientButton } from '../components/GradientButton'
import { PlayersPanel } from '../components/PlayersPanel'
import { IconButton } from '../components/IconButton'
import { ToggleSwitch } from '../components/ToggleSwitch'

export function Create() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateTournamentForm>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      eventType: 'americano',
      tournamentName: '',
      numberOfPlayers: 0,
      numberOfCourts: 0,
      pointsPerMatch: '21',
      matchupStyle: '1&4vs2&3',
      randomRounds: 2,
    },
  })

  const eventType = watch('eventType')
  const numberOfPlayers = watch('numberOfPlayers')
  const numberOfCourts = watch('numberOfCourts')
  const pointsPerMatch = watch('pointsPerMatch')
  const matchupStyle = watch('matchupStyle')
  const randomRounds = watch('randomRounds')

  const [isCourtsExpanded, setIsCourtsExpanded] = useState(false)
  const [isCourtsManuallyEdited, setIsCourtsManuallyEdited] = useState(false)
  const [isPointsExpanded, setIsPointsExpanded] = useState(false)
  const [isMatchupExpanded, setIsMatchupExpanded] = useState(false)
  const [isRandomRoundsExpanded, setIsRandomRoundsExpanded] = useState(false)
  const [isFixedPairs, setIsFixedPairs] = useState(false)
  
  const [players, setPlayers] = useState<string[]>([])

  const maxCourts = Math.floor(numberOfPlayers / 4)

  // Auto-adjust courts based on number of players (unless manually edited)
  useEffect(() => {
    if (!isCourtsManuallyEdited) {
      setValue('numberOfCourts', maxCourts)
    } else if (numberOfCourts > maxCourts) {
      // If manually edited value exceeds new max, cap it
      setValue('numberOfCourts', maxCourts)
    }
  }, [numberOfPlayers, maxCourts, isCourtsManuallyEdited])

  // Sync numberOfPlayers with players array length
  useEffect(() => {
    setValue('numberOfPlayers', players.length, { shouldValidate: true })
  }, [players.length])

  // Handle players change - also update form value
  const handlePlayersChange = (newPlayers: string[]) => {
    setPlayers(newPlayers)
  }

  const onSubmit = (data: CreateTournamentForm) => {
    console.log('Tournament data:', { ...data, players })
    // TODO: Save to store and navigate to tournament page
    navigate('/tournament')
  }

  return (
    <div className="min-h-screen py-8 space-y-8">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => navigate('/')} label={t('create.backToHome')} />
          <h1 className="text-3xl font-bold">{t('create.title')}</h1>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Type */}
        <FormSection>
          <label className="block text-lg font-semibold mb-4">
            {t('create.eventType.label')}
          </label>
          <RadioCardGroup
            name="eventType"
            options={[
              { value: 'americano', label: 'Americano', description: t('create.eventType.americanoDesc') },
              { value: 'mexicano', label: 'Mexicano', description: t('create.eventType.mexicanoDesc') },
            ]}
            value={eventType}
            onChange={(value) => setValue('eventType', value as 'americano' | 'mexicano')}
          />
        </FormSection>

        {/* Tournament Name */}
        <FormSection>
          <label className="block text-lg font-semibold mb-4">
            <PencilLine className="w-5 h-5 inline-block mr-2" />
            {t('create.name.label')}
          </label>
          <input
            type="text"
            {...register('tournamentName')}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-lg focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors"
            placeholder={generateTournamentName(eventType, t)}
          />
          {errors.tournamentName && (
            <p className="text-red-400 text-sm mt-2">{t('create.name.error')}</p>
          )}
        </FormSection>

        {/* Players */}
        <PlayersPanel
          players={players}
          onPlayersChange={handlePlayersChange}
        />

        {/* Number of Courts */}
        <CollapsiblePanel
          icon={<LayoutGrid className="w-5 h-5 inline-block mr-2" />}
          label={t('create.courts.label')}
          value={numberOfCourts}
          isExpanded={isCourtsExpanded}
          onToggle={() => setIsCourtsExpanded(!isCourtsExpanded)}
        >
          <SliderInput
            min={1}
            max={maxCourts}
            value={numberOfCourts}
            onChange={(value) => {
              setValue('numberOfCourts', value, { shouldValidate: true })
              setIsCourtsManuallyEdited(true)
            }}
          />
          {errors.numberOfCourts && (
            <p className="text-red-400 text-sm mt-2">{t('create.courts.error')}</p>
          )}
        </CollapsiblePanel>

        {/* Points Per Match */}
        <CollapsiblePanel
          icon={<Trophy className="w-5 h-5 inline-block mr-2" />}
          label={t('create.points.label')}
          value={pointsPerMatch}
          isExpanded={isPointsExpanded}
          onToggle={() => setIsPointsExpanded(!isPointsExpanded)}
        >
          <RadioCardGroup
            name="pointsPerMatch"
            options={[
              { value: '16', label: '16' },
              { value: '21', label: '21' },
              { value: '24', label: '24' },
              { value: '32', label: '32' },
            ]}
            value={pointsPerMatch}
            onChange={(value) => setValue('pointsPerMatch', value as CreateTournamentForm['pointsPerMatch'])}
          />
          <p className="text-slate-400 text-sm mt-2">
            {t('create.points.desc')}
          </p>
        </CollapsiblePanel>

        {/* Fixed Pairs (Sign up in pairs) */}
        <FormSection>
          <div className="flex items-start gap-3">
            <Handshake className="w-5 h-5 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{t('create.fixedPairs.label')}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {t('create.fixedPairs.desc')}
              </p>
              <p className="text-amber-400 text-sm mt-2 italic">
                {t('create.fixedPairs.notSupported')}
              </p>
            </div>
            <ToggleSwitch
              checked={isFixedPairs}
              onChange={setIsFixedPairs}
              label={t('create.fixedPairs.label')}
              disabled
            />
          </div>
        </FormSection>

        {/* Mexicano-specific options */}
        {eventType === 'mexicano' && (
          <>
            {/* Matchup Style */}
            <CollapsiblePanel
              icon={<Shuffle className="w-5 h-5 inline-block mr-2" />}
              label={t('create.mexicano.matchup.label')}
              value={matchupStyle === '1&4vs2&3' ? t('create.mexicano.matchup.desc1') : t('create.mexicano.matchup.desc2')}
              isExpanded={isMatchupExpanded}
              onToggle={() => setIsMatchupExpanded(!isMatchupExpanded)}
            >
              <RadioCardGroup
                name="matchupStyle"
                options={[
                  { value: '1&4vs2&3', label: t('create.mexicano.matchup.desc1') },
                  { value: '1&3vs2&4', label: t('create.mexicano.matchup.desc2') },
                ]}
                value={matchupStyle || '1&4vs2&3'}
                onChange={(value) => setValue('matchupStyle', value as '1&4vs2&3' | '1&3vs2&4')}
              />
            </CollapsiblePanel>

            {/* Random Rounds */}
            <CollapsiblePanel
              icon={<Dices className="w-5 h-5 inline-block mr-2" />}
              label={t('create.mexicano.randomRounds.label')}
              value={randomRounds || 2}
              isExpanded={isRandomRoundsExpanded}
              onToggle={() => setIsRandomRoundsExpanded(!isRandomRoundsExpanded)}
            >
              <SliderInput
                min={1}
                max={5}
                value={randomRounds || 2}
                onChange={(value) => setValue('randomRounds', value, { shouldValidate: true })}
              />
              <p className="text-slate-400 text-sm mt-2">
                {t('create.mexicano.randomRounds.desc')}
              </p>
            </CollapsiblePanel>
          </>
        )}

        {/* Submit Button */}
        <GradientButton type="submit" fullWidth disabled={players.length < 4}>
          {t('create.submit')}
        </GradientButton>
        </form>
      </div>
    </div>
  )
}
