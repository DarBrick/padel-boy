import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LayoutGrid, PencilLine, Shuffle, Dices, Trophy, Handshake, Grid2X2Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { createTournamentSchema, type CreateTournamentForm, type StoredTournament } from '../schemas/tournament'
import { generateTournamentName } from '../utils/tournament'
import { generateTournamentId } from '../utils/tournamentId'
import { useTournaments } from '../stores/tournaments'
import { CollapsiblePanel } from '../components/CollapsiblePanel'
import { SliderInput } from '../components/SliderInput'
import { RadioCardGroup } from '../components/RadioCardGroup'
import { GradientButton } from '../components/GradientButton'
import { PlayersPanel } from '../components/PlayersPanel'
import { IconButton } from '../components/IconButton'
import { ToggleSwitch } from '../components/ToggleSwitch'
import { CourtChip } from '../components/CourtChip'
import { ContentPanel } from '../components/ContentPanel'

export function Create() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { addTournament } = useTournaments()

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
  const [isPointsExpanded, setIsPointsExpanded] = useState(false)
  const [isMatchupExpanded, setIsMatchupExpanded] = useState(false)
  const [isRandomRoundsExpanded, setIsRandomRoundsExpanded] = useState(false)
  const [isFixedPairs, setIsFixedPairs] = useState(false)
  
  const [players, setPlayers] = useState<string[]>([])
  const [courtNames, setCourtNames] = useState<string[]>([])
  const [prepareForLater, setPrepareForLater] = useState(false)

  const maxCourts = Math.floor(numberOfPlayers / 4)

  // Auto-adjust courts based on number of players
  useEffect(() => {
    const newCourts = Math.floor(players.length / 4)
    setValue('numberOfCourts', newCourts)
    
    // Sync courtNames array with new courts count
    setCourtNames(prev => {
      if (newCourts > prev.length) {
        // Add empty strings for new courts
        return [...prev, ...Array(newCourts - prev.length).fill('')]
      } else if (newCourts < prev.length) {
        // Trim array if courts decreased
        return prev.slice(0, newCourts)
      }
      return prev
    })
  }, [players.length, setValue])

  // Sync numberOfPlayers with players array length
  useEffect(() => {
    setValue('numberOfPlayers', players.length, { shouldValidate: true })
  }, [players.length])

  // Handle players change - also update form value
  const handlePlayersChange = (newPlayers: string[]) => {
    setPlayers(newPlayers)
  }

  // Handle court name change
  const handleCourtNameChange = (index: number, newName: string) => {
    setCourtNames(prev => {
      const updated = [...prev]
      updated[index] = newName
      return updated
    })
  }

  // Handle add court
  const handleAddCourt = () => {
    if (numberOfCourts < maxCourts) {
      const newCount = numberOfCourts + 1
      setValue('numberOfCourts', newCount, { shouldValidate: true })
      setCourtNames(prev => [...prev, ''])
    }
  }

  // Handle remove court
  const handleRemoveCourt = () => {
    if (numberOfCourts > 1) {
      const newCount = numberOfCourts - 1
      setValue('numberOfCourts', newCount, { shouldValidate: true })
      setCourtNames(prev => prev.slice(0, -1))
    }
  }

  const onSubmit = (data: CreateTournamentForm) => {
    // Create tournament object
    const tournamentId = generateTournamentId()
    const tournamentName = data.tournamentName || generateTournamentName(data.eventType, t)
    
    // Convert court names array to record format
    const courtNamesRecord: Record<number, string> = {}
    courtNames.forEach((name, index) => {
      if (name.trim()) {
        courtNamesRecord[index] = name.trim().slice(0, 16) // Max 16 chars as per schema
      }
    })
    
    // Create StoredTournament object
    const storedTournament: StoredTournament = {
      version: 1,
      id: tournamentId,
      name: tournamentName.slice(0, 40), // Max 40 chars as per schema
      format: data.eventType,
      pointsPerGame: parseInt(data.pointsPerMatch) as 16 | 21 | 24 | 32,
      numberOfCourts: data.numberOfCourts,
      isFixedPairs: false, // Not yet supported
      playerCount: players.length,
      players: players.map(name => ({ name: name.slice(0, 16) })), // Max 16 chars per player
      matches: [], // Matches will be generated when tournament starts
      courtNames: Object.keys(courtNamesRecord).length > 0 ? courtNamesRecord : undefined,
      // Mexicano-specific options
      ...(data.eventType === 'mexicano' && {
        mexicanoMatchupStyle: data.matchupStyle,
        mexicanoRandomRounds: data.randomRounds,
      }),
    }
    
    // Save tournament to store
    addTournament(storedTournament)
    
    console.log('Tournament saved:', storedTournament)
    
    if (prepareForLater) {
      // Tournament saved for later
      // TODO: Add toast notification for saved tournament
      navigate('/')
    } else {
      // Start tournament immediately
      // TODO: Navigate to tournament page with the ID
      navigate(`/tournament/${tournamentId}`)
    }
  }

  return (
    <div className="min-h-screen py-8 space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => navigate('/')} label={t('create.backToHome')} />
          <h1 className="text-3xl font-bold">{t('create.title')}</h1>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Event Type */}
        <ContentPanel>
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
        </ContentPanel>

        {/* Tournament Name */}
        <ContentPanel>
          <label className="block text-lg font-semibold mb-4">
            <PencilLine className="w-5 h-5 inline-block mr-2" />
            {t('create.name.label')}
          </label>
          <input
            type="text"
            {...register('tournamentName')}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-lg focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors"
            placeholder={generateTournamentName(eventType, t)}
            maxLength={40}
          />
          {errors.tournamentName && (
            <p className="text-red-400 text-sm mt-2">{t('create.name.error')}</p>
          )}
        </ContentPanel>

        {/* Players */}
        <PlayersPanel
          players={players}
          onPlayersChange={handlePlayersChange}
        />

        {/* Number of Courts */}
        <CollapsiblePanel
          icon={<LayoutGrid className="w-5 h-5 inline-block mr-2" />}
          label={t('create.courts.label')}
          value={numberOfCourts === 1 ? t('create.courts.count', { count: 1 }) : t('create.courts.count', { count: numberOfCourts })}
          isExpanded={isCourtsExpanded}
          onToggle={() => setIsCourtsExpanded(!isCourtsExpanded)}
        >
          {players.length < 4 ? (
            <p className="text-slate-400 text-sm">
              {t('create.courts.emptyState')}
            </p>
          ) : (
            <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Array.from({ length: numberOfCourts }).map((_, index) => (
                  <CourtChip
                    key={index}
                    name={courtNames[index] || ''}
                    index={index}
                    onRename={(newName) => handleCourtNameChange(index, newName)}
                    onDelete={handleRemoveCourt}
                    canRemove={numberOfCourts > 1}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddCourt}
                disabled={numberOfCourts >= maxCourts}
                className="flex items-center gap-2 px-5 py-2.5 sm:py-2.5 md:py-3 text-base text-slate-300 hover:text-[var(--color-padel-yellow)] border border-dashed border-slate-600 hover:border-[var(--color-padel-yellow)]/50 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-slate-300 disabled:hover:border-slate-600"
              >
                <Grid2X2Plus className="w-5 h-5" />
                {t('create.courts.addButton')}
              </button>
            </div>
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
        <ContentPanel>
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
        </ContentPanel>

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

        {/* Submit Buttons */}
        <div className="space-y-3">
          <GradientButton 
            type="submit" 
            fullWidth 
            disabled={players.length < 4}
            onClick={() => setPrepareForLater(false)}
          >
            {t('create.submitStart')}
          </GradientButton>
          <button
            type="submit"
            disabled={players.length < 4}
            onClick={() => setPrepareForLater(true)}
            className="w-full px-6 py-3 text-base font-medium text-slate-300 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-700 hover:text-[var(--color-padel-yellow)] hover:border-[var(--color-padel-yellow)]/50 transition-all min-h-[44px] sm:min-h-[46px] md:min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-700/50 disabled:hover:text-slate-300 disabled:hover:border-slate-600"
          >
            {t('create.submitPrepare')}
          </button>
        </div>
        </form>
      </div>
    </div>
  )
}
