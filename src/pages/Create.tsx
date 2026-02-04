import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Users, LayoutGrid, PencilLine, Shuffle, Dices } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'

import { createTournamentSchema, type CreateTournamentForm } from '../schemas/tournament'
import { generateTournamentName } from '../utils/tournament'
import { FormSection } from '../components/FormSection'
import { CollapsiblePanel } from '../components/CollapsiblePanel'
import { SliderInput } from '../components/SliderInput'
import { RadioCardGroup } from '../components/RadioCardGroup'
import { GradientButton } from '../components/GradientButton'

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
      tournamentName: generateTournamentName('americano', t),
      numberOfPlayers: 8,
      numberOfCourts: 2,
      matchupStyle: '1&4vs2&3',
      randomRounds: 2,
    },
  })

  const eventType = watch('eventType')
  const numberOfPlayers = watch('numberOfPlayers')
  const numberOfCourts = watch('numberOfCourts')
  const matchupStyle = watch('matchupStyle')
  const randomRounds = watch('randomRounds')

  const [isManuallyEdited, setIsManuallyEdited] = useState(false)
  const [isCourtsExpanded, setIsCourtsExpanded] = useState(false)
  const [isCourtsManuallyEdited, setIsCourtsManuallyEdited] = useState(false)
  const [isMatchupExpanded, setIsMatchupExpanded] = useState(false)
  const [isRandomRoundsExpanded, setIsRandomRoundsExpanded] = useState(false)
  const previousEventTypeRef = useRef(eventType)

  const maxCourts = Math.floor(numberOfPlayers / 4)

  // Reset tournament name on mount
  useEffect(() => {
    setValue('tournamentName', generateTournamentName(eventType, t))
    setIsManuallyEdited(false)
  }, [])

  // Auto-adjust courts based on number of players (unless manually edited)
  useEffect(() => {
    if (!isCourtsManuallyEdited) {
      setValue('numberOfCourts', maxCourts)
    } else if (numberOfCourts > maxCourts) {
      // If manually edited value exceeds new max, cap it
      setValue('numberOfCourts', maxCourts)
    }
  }, [numberOfPlayers, maxCourts, isCourtsManuallyEdited])

  // Update tournament name when event type changes (unless manually edited)
  useEffect(() => {
    if (eventType !== previousEventTypeRef.current && !isManuallyEdited) {
      setValue('tournamentName', generateTournamentName(eventType, t))
      previousEventTypeRef.current = eventType
    }
  }, [eventType, t, isManuallyEdited])

  const onSubmit = (data: CreateTournamentForm) => {
    console.log('Tournament data:', data)
    // TODO: Save to store and navigate to players page
    navigate('/players')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="
            p-3 
            bg-slate-800 
            hover:bg-slate-700 
            border border-slate-600 
            hover:border-[var(--color-padel-yellow)]
            rounded-full 
            transition-all duration-200
            shadow-lg hover:shadow-xl
            group
          "
          aria-label={t('create.backToHome')}
        >
          <ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-[var(--color-padel-yellow)] transition-colors" />
        </button>
        <h1 className="text-3xl font-bold">{t('create.title')}</h1>
      </div>

      {/* Form */}
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
            onChange={(e) => {
              register('tournamentName').onChange(e)
              setIsManuallyEdited(true)
            }}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-lg focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors"
            placeholder={t('create.name.placeholder')}
          />
          {errors.tournamentName && (
            <p className="text-red-400 text-sm mt-2">{t('create.name.error')}</p>
          )}
        </FormSection>

        {/* Number of Players */}
        <FormSection>
          <label className="block text-lg font-semibold mb-4">
            <Users className="w-5 h-5 inline-block mr-2" />
            {t('create.players.label')}
          </label>
          <SliderInput
            min={4}
            max={40}
            value={numberOfPlayers}
            onChange={(value) => setValue('numberOfPlayers', value, { shouldValidate: true })}
          />
          {errors.numberOfPlayers && (
            <p className="text-red-400 text-sm mt-2">{t('create.players.error')}</p>
          )}
        </FormSection>

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
        <GradientButton type="submit" fullWidth>
          {t('create.submit')}
        </GradientButton>
      </form>
    </div>
  )
}
