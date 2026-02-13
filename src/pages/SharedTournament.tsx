import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { decodeBase64Url, decodeTournament } from '../utils/binaryFormat'
import { storedTournamentSchema } from '../schemas/tournament'
import { useTournaments } from '../stores/tournaments'
import { ContentPanel } from '../components/ContentPanel'

export function SharedTournament() {
  const { data } = useParams<{ data: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { addTournamentIfNotExists } = useTournaments()

  useEffect(() => {
    if (!data) {
      toast.error(t('shared.error.description'))
      navigate('/')
      return
    }

    try {
      // Decode base64url → binary → tournament object
      const binaryData = decodeBase64Url(data)
      const decodedTournament = decodeTournament(binaryData)
      
      // Validate with Zod schema
      const result = storedTournamentSchema.safeParse(decodedTournament)
      
      if (!result.success) {
        console.error('Tournament validation failed:', result.error)
        toast.error(t('shared.error.description'))
        navigate('/')
        return
      }

      // Auto-save to local storage
      const isNew = addTournamentIfNotExists(result.data)
      
      // Redirect to tournament page with notification state
      navigate(`/tournament/${result.data.id}`, { 
        replace: true,
        state: { fromSharedLink: true, isNew }
      })
      
    } catch (error) {
      console.error('Failed to decode shared tournament:', error)
      toast.error(t('shared.error.description'))
      navigate('/')
    }
  }, [data, t, navigate, addTournamentIfNotExists])

  // Loading state (shown briefly before redirect)
  return (
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      <ContentPanel>
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-4">
            <div className="w-8 h-8 border-4 border-slate-600 border-t-[var(--color-padel-yellow)] rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t('shared.loading')}
          </h2>
        </div>
      </ContentPanel>
    </div>
  )
}
