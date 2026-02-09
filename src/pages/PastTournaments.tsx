import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Search, History, Inbox, ArrowUp, Download, X, ArrowLeftFromLine, ArrowRightFromLine, ChevronDown } from 'lucide-react'
import { IconButton } from '../components/IconButton'
import { TournamentCard } from '../components/TournamentCard'
import { GradientButton } from '../components/GradientButton'
import { CorruptionBanner } from '../components/CorruptionBanner'
import { useTournaments } from '../stores/tournaments'
import { groupTournamentsByDate } from '../utils/dateGrouping'
import { encodeTournament } from '../utils/binaryFormat'
import { filterTournamentsBySearch } from '../utils/tournamentSearch'
import type { StoredTournament } from '../schemas/tournament'
import type { TournamentStatus } from '../utils/tournamentSearch'

export function PastTournaments() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { tournaments, deleteTournament } = useTournaments()
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(10)
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Filter states
  const [selectedFormat, setSelectedFormat] = useState<'americano' | 'mexicano' | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<TournamentStatus | null>(null)
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  
  // Reset visible count when search query or filters change
  useEffect(() => {
    setVisibleCount(10)
  }, [searchQuery, selectedFormat, selectedStatus, dateFrom, dateTo])
  
  // Handle scroll for scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Parse date strings to Date objects for filtering
  const dateRange = useMemo(() => {
    return {
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo + 'T23:59:59') : undefined, // End of day
    }
  }, [dateFrom, dateTo])
  
  // Filter tournaments by search query and filters
  const filteredTournaments = useMemo(() => {
    return filterTournamentsBySearch(tournaments, searchQuery, {
      format: selectedFormat || undefined,
      status: selectedStatus || undefined,
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo,
    })
  }, [tournaments, searchQuery, selectedFormat, selectedStatus, dateRange])
  
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
    <div className="space-y-6 sm:space-y-7 md:space-y-8">
      {/* Header */}
      <div>
        <div className="mb-6">
          <IconButton onClick={() => navigate(-1)} label={t('pastTournaments.back')} />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('pastTournaments.title')}
        </h1>
        <p className="text-slate-300 text-base md:text-lg mb-6">
          {t('pastTournaments.subtitle')}
        </p>
        
        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('pastTournaments.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-base text-white placeholder:text-slate-400 focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors"
          />
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Format dropdown with clear button */}
          <div className="relative">
            <select
              value={selectedFormat || ''}
              onChange={(e) => setSelectedFormat(e.target.value as 'americano' | 'mexicano' || null)}
              className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors appearance-none min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
            >
              <option value="">{t('pastTournaments.filters.allFormats')}</option>
              <option value="americano">Americano</option>
              <option value="mexicano">Mexicano</option>
            </select>
            {!selectedFormat && (
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}
            {selectedFormat && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFormat(null)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
                aria-label="Clear format filter"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          
          {/* Status dropdown with clear button */}
          <div className="relative">
            <select
              value={selectedStatus || ''}
              onChange={(e) => setSelectedStatus(e.target.value as TournamentStatus || null)}
              className="w-full px-3 py-2 pr-10 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors appearance-none min-h-[44px] sm:min-h-[46px] md:min-h-[48px]"
            >
              <option value="">{t('pastTournaments.filters.allStatus')}</option>
              <option value="setup">{t('pastTournaments.filters.setup')}</option>
              <option value="in-progress">{t('pastTournaments.filters.inProgress')}</option>
              <option value="finished">{t('pastTournaments.filters.finished')}</option>
            </select>
            {!selectedStatus && (
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            )}
            {selectedStatus && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedStatus(null)
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
                aria-label="Clear status filter"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
          
          {/* Date range with clear buttons */}
          <div className="relative">
            <ArrowRightFromLine className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none z-10" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              max={dateTo || undefined}
              className="w-full pl-9 pr-9 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-1 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:hover:brightness-150"
            />
            {dateFrom && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDateFrom('')
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors z-10"
                aria-label="Clear from date"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
          
          <div className="relative">
            <ArrowLeftFromLine className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none z-10" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              min={dateFrom || undefined}
              className="w-full pl-9 pr-9 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-[var(--color-padel-yellow)] focus:outline-none transition-colors min-h-[44px] sm:min-h-[46px] md:min-h-[48px] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-1 [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:hover:brightness-150"
            />
            {dateTo && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDateTo('')
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors z-10"
                aria-label="Clear to date"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div>
        {/* Result count */}
        {hasResults && (
          <div className="mb-4 text-sm text-slate-400">
            {t('pastTournaments.resultCount', { count: filteredTournaments.length })}
          </div>
        )}
        
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
