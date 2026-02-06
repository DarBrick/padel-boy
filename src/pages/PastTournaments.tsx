import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Search, History, Inbox, ArrowUp, Download } from 'lucide-react'
import { IconButton } from '../components/IconButton'
import { TournamentCard } from '../components/TournamentCard'
import { GradientButton } from '../components/GradientButton'
import { CorruptionBanner } from '../components/CorruptionBanner'
import { useTournaments } from '../stores/tournaments'
import { groupTournamentsByDate } from '../utils/dateGrouping'
import { encodeTournament } from '../utils/binaryFormat'
import type { StoredTournament } from '../schemas/tournament'

export function PastTournaments() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { tournaments, deleteTournament } = useTournaments()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Reset visible count when search query changes
  useEffect(() => {
    setVisibleCount(10)
  }, [searchQuery])
  
  // Handle scroll for scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Filter tournaments by search query
  const filteredTournaments = useMemo(() => {
    if (!searchQuery.trim()) {
      return tournaments
    }
    
    const query = searchQuery.toLowerCase().trim()
    return tournaments.filter(tournament => {
      const name = tournament.name?.toLowerCase() || ''
      return name.includes(query)
    })
  }, [tournaments, searchQuery])
  
  // Apply pagination to filtered tournaments
  const paginatedTournaments = useMemo(() => {
    return filteredTournaments.slice(0, visibleCount)
  }, [filteredTournaments, visibleCount])
  
  // Group paginated tournaments by date
  const groupedTournaments = useMemo(() => {
    return groupTournamentsByDate(paginatedTournaments, t)
  }, [paginatedTournaments, t])
  
  const hasMore = filteredTournaments.length > visibleCount
  
  // Handle view tournament
  const handleView = (id: string) => {
    navigate(`/tournament/${id}`)
  }
  
  // Handle share tournament
  const handleShare = async (tournament: StoredTournament) => {
    try {
      const encoded = encodeTournament(tournament)
      const base64 = btoa(String.fromCharCode(...encoded))
      // Get base URL from current location (handles both local and GitHub Pages)
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/past$/, '')
      const url = `${baseUrl}?t=${base64}`
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
        // TODO: Show success toast notification
        console.log('Tournament link copied to clipboard')
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        console.log('Tournament link copied to clipboard (fallback)')
      }
    } catch (error) {
      console.error('Failed to share tournament:', error)
      // TODO: Show error toast notification
    }
  }
  
  // Handle delete tournament (with confirmation)
  const handleDeleteRequest = (id: string) => {
    setDeleteConfirmId(id)
  }
  
  const handleDeleteConfirm = (id: string) => {
    deleteTournament(id)
    setDeleteConfirmId(null)
  }
  
  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }
  
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 10)
  }
  
  const hasResults = filteredTournaments.length > 0
  const hasSearch = searchQuery.trim().length > 0
  
  return (
    <div className="min-h-screen py-8 space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <IconButton onClick={() => navigate(-1)} label={t('pastTournaments.back')} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t('pastTournaments.title')}
            </h1>
            <p className="text-slate-300 text-base md:text-lg">
              {t('pastTournaments.subtitle')}
            </p>
          </div>
        </div>
        
        {/* Search input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('pastTournaments.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-base text-white placeholder:text-slate-400 focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors"
          />
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Corruption Banner */}
        <CorruptionBanner />
        
        {!hasResults && !hasSearch && (
          // Empty state - no tournaments
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-4">
              <History className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('pastTournaments.emptyState.title')}
            </h2>
            <p className="text-slate-400 text-lg mb-6 max-w-md mx-auto">
              {t('pastTournaments.emptyState.description')}
            </p>
            <GradientButton onClick={() => navigate('/create')}>
              {t('pastTournaments.emptyState.createButton')}
            </GradientButton>
          </div>
        )}
        
        {!hasResults && hasSearch && (
          // Empty state - no search results
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-4">
              <Inbox className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t('pastTournaments.noResults.title')}
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              {t('pastTournaments.noResults.description', { query: searchQuery })}
            </p>
          </div>
        )}
        
        {hasResults && (
          <>
            {/* Tournament groups */}
            <div className="space-y-8">
              {groupedTournaments.map((group) => (
                <div key={group.label}>
                  <h2 className="text-xl font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    {group.label}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.tournaments.map((tournament) => (
                      <TournamentCard
                        key={tournament.id}
                        tournament={tournament}
                        onView={handleView}
                        onShare={handleShare}
                        onDelete={handleDeleteRequest}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More button */}
            {hasMore && (
              <div className="mt-8 text-center space-y-4">
                <p className="text-slate-400 text-sm">
                  {t('pastTournaments.showing', { 
                    count: paginatedTournaments.length, 
                    total: filteredTournaments.length 
                  })}
                </p>
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-2.5 md:py-3 text-base text-slate-300 hover:text-[var(--color-padel-yellow)] border border-dashed border-slate-600 hover:border-[var(--color-padel-yellow)]/50 rounded-lg transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
                >
                  <Download className="w-5 h-5" />
                  {t('pastTournaments.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Scroll to Top button */}
      {showScrollTop && (
        <div className="fixed bottom-8 right-8 z-40">
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            icon={ArrowUp}
            label={t('pastTournaments.scrollToTop')}
          />
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">
              {t('pastTournaments.deleteConfirm.title')}
            </h3>
            <p className="text-slate-300 mb-6">
              {t('pastTournaments.deleteConfirm.description')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-2.5 text-base font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors min-h-[44px]"
              >
                {t('pastTournaments.deleteConfirm.cancel')}
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirmId)}
                className="flex-1 px-4 py-2.5 text-base font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors min-h-[44px]"
              >
                {t('pastTournaments.deleteConfirm.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
