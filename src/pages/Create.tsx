import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Users, LayoutGrid, Type, Shuffle, Dices } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import type { TFunction } from 'i18next'

function generateTournamentName(
  eventType: 'americano' | 'mexicano',
  t: TFunction
): string {
  const prefix = eventType === 'mexicano' ? 'Mex' : 'Am'
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const monthIndex = now.getMonth()
  const month = t(`months.${monthIndex}`)
  return `${prefix}_${day}_${month}`
}

const createTournamentSchema = z.object({
  eventType: z.enum(['americano', 'mexicano']),
  tournamentName: z.string().min(1).max(50),
  numberOfPlayers: z.number().min(4).max(40),
  numberOfCourts: z.number().min(1).max(10),
  // Mexicano-specific fields
  matchupStyle: z.enum(['1&4vs2&3', '1&3vs2&4']).optional(),
  randomRounds: z.number().min(1).max(5).optional(),
})

type CreateTournamentForm = z.infer<typeof createTournamentSchema>

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
  const tournamentName = watch('tournamentName')
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
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          aria-label={t('create.backToHome')}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">{t('create.title')}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Type */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <label className="block text-lg font-semibold mb-4">
            {t('create.eventType.label')}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`
                flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                ${eventType === 'americano' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-600 hover:border-slate-500'}
              `}
            >
              <input
                type="radio"
                value="americano"
                {...register('eventType')}
                className="sr-only"
              />
              <span className="text-xl font-bold mb-1">Americano</span>
              <span className="text-sm text-slate-400 text-center">
                {t('create.eventType.americanoDesc')}
              </span>
            </label>
            <label
              className={`
                flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                ${eventType === 'mexicano' 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-slate-600 hover:border-slate-500'}
              `}
            >
              <input
                type="radio"
                value="mexicano"
                {...register('eventType')}
                className="sr-only"
              />
              <span className="text-xl font-bold mb-1">Mexicano</span>
              <span className="text-sm text-slate-400 text-center">
                {t('create.eventType.mexicanoDesc')}
              </span>
            </label>
          </div>
        </div>

        {/* Tournament Name */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <label className="block text-lg font-semibold mb-4">
            <Type className="w-5 h-5 inline-block mr-2" />
            {t('create.name.label')}
          </label>
          <input
            type="text"
            {...register('tournamentName')}
            onChange={(e) => {
              register('tournamentName').onChange(e)
              setIsManuallyEdited(true)
            }}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-lg focus:border-blue-500 focus:outline-none transition-colors"
            placeholder={t('create.name.placeholder')}
          />
          {errors.tournamentName && (
            <p className="text-red-400 text-sm mt-2">{t('create.name.error')}</p>
          )}
        </div>

        {/* Number of Players */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
          <label className="block text-lg font-semibold mb-4">
            <Users className="w-5 h-5 inline-block mr-2" />
            {t('create.players.label')}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={4}
              max={40}
              step={1}
              value={numberOfPlayers}
              onChange={(e) => setValue('numberOfPlayers', parseInt(e.target.value), { shouldValidate: true })}
              className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <input
              type="number"
              min={4}
              max={40}
              value={numberOfPlayers}
              onChange={(e) => setValue('numberOfPlayers', parseInt(e.target.value), { shouldValidate: true })}
              className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-center text-lg font-bold"
            />
          </div>
          {errors.numberOfPlayers && (
            <p className="text-red-400 text-sm mt-2">{t('create.players.error')}</p>
          )}
        </div>

        {/* Number of Courts */}
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsCourtsExpanded(!isCourtsExpanded)}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
          >
            <span className="text-lg font-semibold">
              <LayoutGrid className="w-5 h-5 inline-block mr-2" />
              {t('create.courts.label')} <span className="text-slate-400">({numberOfCourts})</span>
            </span>
            <span className="text-slate-400">
              {isCourtsExpanded ? '▲' : '▼'}
            </span>
          </button>
          
          {isCourtsExpanded && (
            <div className="px-6 pb-6">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={1}
                  max={maxCourts}
                  step={1}
                  value={numberOfCourts}
                  onChange={(e) => {
                    setValue('numberOfCourts', parseInt(e.target.value), { shouldValidate: true })
                    setIsCourtsManuallyEdited(true)
                  }}
                  className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  min={1}
                  max={maxCourts}
                  value={numberOfCourts}
                  onChange={(e) => {
                    setValue('numberOfCourts', parseInt(e.target.value), { shouldValidate: true })
                    setIsCourtsManuallyEdited(true)
                  }}
                  className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-center text-lg font-bold"
                />
              </div>
              {errors.numberOfCourts && (
                <p className="text-red-400 text-sm mt-2">{t('create.courts.error')}</p>
              )}
            </div>
          )}
        </div>

        {/* Mexicano-specific options */}
        {eventType === 'mexicano' && (
          <>
            {/* Matchup Style */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsMatchupExpanded(!isMatchupExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <span className="text-lg font-semibold">
                  <Shuffle className="w-5 h-5 inline-block mr-2" />
                  {t('create.mexicano.matchup.label')} <span className="text-slate-400">({matchupStyle === '1&4vs2&3' ? t('create.mexicano.matchup.desc1') : t('create.mexicano.matchup.desc2')})</span>
                </span>
                <span className="text-slate-400">
                  {isMatchupExpanded ? '▲' : '▼'}
                </span>
              </button>
              
              {isMatchupExpanded && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`
                        flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${matchupStyle === '1&4vs2&3' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-slate-600 hover:border-slate-500'}
                      `}
                    >
                      <input
                        type="radio"
                        value="1&4vs2&3"
                        {...register('matchupStyle')}
                        className="sr-only"
                      />
                      <span className="text-xl font-bold text-center">
                        {t('create.mexicano.matchup.desc1')}
                      </span>
                    </label>
                    <label
                      className={`
                        flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${matchupStyle === '1&3vs2&4' 
                          ? 'border-blue-500 bg-blue-500/10' 
                          : 'border-slate-600 hover:border-slate-500'}
                      `}
                    >
                      <input
                        type="radio"
                        value="1&3vs2&4"
                        {...register('matchupStyle')}
                        className="sr-only"
                      />
                      <span className="text-xl font-bold text-center">
                        {t('create.mexicano.matchup.desc2')}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Random Rounds */}
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setIsRandomRoundsExpanded(!isRandomRoundsExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
              >
                <span className="text-lg font-semibold">
                  <Dices className="w-5 h-5 inline-block mr-2" />
                  {t('create.mexicano.randomRounds.label')} <span className="text-slate-400">({randomRounds})</span>
                </span>
                <span className="text-slate-400">
                  {isRandomRoundsExpanded ? '▲' : '▼'}
                </span>
              </button>
              
              {isRandomRoundsExpanded && (
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={randomRounds}
                      onChange={(e) => setValue('randomRounds', parseInt(e.target.value), { shouldValidate: true })}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={randomRounds}
                      onChange={(e) => setValue('randomRounds', parseInt(e.target.value), { shouldValidate: true })}
                      className="w-20 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-center text-lg font-bold"
                    />
                  </div>
                  <p className="text-slate-400 text-sm mt-2">
                    {t('create.mexicano.randomRounds.desc')}
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="
            w-full py-4 
            bg-gradient-to-r from-blue-600 to-[#D4FF00] 
            hover:from-blue-500 hover:to-[#C5F000]
            rounded-lg 
            text-lg font-semibold
            transition-all duration-200
            shadow-lg hover:shadow-xl
          "
        >
          {t('create.submit')}
        </button>
      </form>
    </div>
  )
}
