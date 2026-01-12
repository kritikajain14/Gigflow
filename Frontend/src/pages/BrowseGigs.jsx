import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { useDebounce } from '../hooks/useDebounce'
import { 
  FiSearch, 
  FiDollarSign, 
  FiCalendar,
  FiUser,
  FiFilter,
  FiLoader,
  FiPlus,
  FiClock,
  FiCheckCircle,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiMapPin
} from 'react-icons/fi'

export default function BrowseGigs() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [budgetFilter, setBudgetFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const debouncedSearch = useDebounce(search, 500)

  // Initialize from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search') || ''
    const pageParam = parseInt(searchParams.get('page') || '1')
    const budgetParam = searchParams.get('budget') || 'all'
    const sortParam = searchParams.get('sort') || 'newest'
    
    setSearch(searchParam)
    setPage(pageParam)
    setBudgetFilter(budgetParam)
    setSortBy(sortParam)
  }, [searchParams])

  const fetchGigs = useCallback(async () => {
    try {
      setLoading(true)
      
      const params = {
        search: debouncedSearch,
        page,
        limit: 12,
        sort: sortBy,
        ...(budgetFilter !== 'all' && { budget: budgetFilter })
      }

      const response = await axios.get('/api/gigs', { params })
      
      if (response.data.success) {
        setGigs(response.data.gigs)
        setTotalPages(response.data.pagination.pages)
        setTotalItems(response.data.pagination.total)
      }
    } catch (error) {
      console.error('Error fetching gigs:', error)
      showNotification('Failed to load gigs', 'error')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, page, budgetFilter, sortBy, showNotification])

  useEffect(() => {
    fetchGigs()
  }, [fetchGigs])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page > 1) params.set('page', page.toString())
    if (budgetFilter !== 'all') params.set('budget', budgetFilter)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    
    setSearchParams(params, { replace: true })
  }, [search, page, budgetFilter, sortBy, setSearchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  const handleBudgetFilter = (filter) => {
    setBudgetFilter(filter)
    setPage(1)
  }

  const handleSortChange = (value) => {
    setSortBy(value)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
  }

  const clearFilters = () => {
    setSearch('')
    setBudgetFilter('all')
    setSortBy('newest')
    setPage(1)
    setSearchParams({})
  }

  const budgetFilters = [
    { value: 'all', label: 'All Budgets' },
    { value: 'under-500', label: 'Under $500' },
    { value: '500-2000', label: '$500 - $2k' },
    { value: '2000-5000', label: '$2k - $5k' },
    { value: 'over-5000', label: 'Over $5k' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'budget-desc', label: 'Highest Budget' },
    { value: 'budget-asc', label: 'Lowest Budget' }
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00537A] text-white rounded-xl touch-target"
        >
          <FiFilter />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      <div className="lg:flex lg:gap-6">
        {/* Filters Sidebar - Hidden on mobile, shown when toggled */}
        <AnimatePresence>
          {(showFilters || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="lg:w-64 mb-6 lg:mb-0"
            >
              <div className="glass rounded-2xl p-4 sm:p-6 sticky top-24">
                {/* Close button for mobile */}
                <div className="lg:hidden flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-[#A8E8F9] hover:text-white touch-target p-2"
                    aria-label="Close filters"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                {/* Search Input */}
                <div className="mb-6">
                  <label className="block text-white mb-2 text-sm font-medium">
                    Search Gigs
                  </label>
                  <form onSubmit={handleSearch} className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="React developer, designer..."
                      className="form-input pl-10 text-sm"
                    />
                  </form>
                </div>

                {/* Budget Filters */}
                <div className="mb-6">
                  <h4 className="text-white mb-3 text-sm font-medium">Budget Range</h4>
                  <div className="space-y-2">
                    {budgetFilters.map((filter) => (
                      <button
                        key={filter.value}
                        onClick={() => handleBudgetFilter(filter.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          budgetFilter === filter.value
                            ? 'bg-[#F5A201] text-[#013C58] font-medium'
                            : 'text-[#A8E8F9] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mb-6">
                  <h4 className="text-white mb-3 text-sm font-medium">Sort By</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          sortBy === option.value
                            ? 'bg-[#F5A201] text-[#013C58] font-medium'
                            : 'text-[#A8E8F9] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Filters & Clear */}
                {(search || budgetFilter !== 'all' || sortBy !== 'newest') && (
                  <div className="pt-4 border-t border-[#00537A]">
                    <button
                      onClick={clearFilters}
                      className="w-full px-3 py-2 text-sm text-[#F5A201] hover:text-white hover:bg-[#F5A201]/10 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <FiX size={14} />
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Available <span className="gradient-text">Gigs</span>
              </h1>
              <p className="text-[#A8E8F9] text-sm">
                {totalItems > 0 ? `${totalItems} gigs found` : 'Search for gigs'}
              </p>
            </div>
            
            {user && (
              <Link 
                to="/post-gig" 
                className="btn-primary flex items-center justify-center gap-2 sm:w-auto"
              >
                <FiPlus />
                <span className="hidden sm:inline">Post a Gig</span>
                <span className="sm:hidden">Post</span>
              </Link>
            )}
          </div>

          {/* Gigs Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FiLoader className="animate-spin text-4xl text-[#F5A201]" />
            </div>
          ) : gigs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="text-6xl mb-4 text-[#A8E8F9]">📋</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
                No gigs found
              </h3>
              <p className="text-[#A8E8F9] mb-6 max-w-md mx-auto">
                {search ? 'Try a different search term' : 'Be the first to post a gig!'}
              </p>
              {user && !search && (
                <Link to="/post-gig" className="btn-primary inline-flex">
                  Post Your First Gig
                </Link>
              )}
            </motion.div>
          ) : (
            <>
              {/* Desktop Sort Controls */}
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[#A8E8F9] text-sm">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-[#00537A] text-white text-sm rounded-lg px-3 py-2 border border-[#00537A] focus:outline-none focus:ring-2 focus:ring-[#F5A201]"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[#A8E8F9] text-sm">
                  Showing {(page - 1) * 12 + 1}-{Math.min(page * 12, totalItems)} of {totalItems}
                </p>
              </div>

              {/* Gigs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                {gigs.map((gig, index) => (
                  <motion.div
                    key={gig._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card-glass hover:shadow-[0_0_20px_rgba(245,162,1,0.1)] group"
                  >
                    <div className="p-4 sm:p-6 flex flex-col h-full">
                      {/* Gig Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2 group-hover:text-[#F5A201] transition-colors">
                            {gig.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[#A8E8F9] text-sm">
                            <FiUser size={12} />
                            <span className="truncate">{gig.ownerId?.name}</span>
                          </div>
                        </div>
                        <div className="px-2 py-1 gradient-bg rounded-full ml-2 shrink-0">
                          <span className="text-[#013C58] font-semibold text-sm">
                            {formatCurrency(gig.budget)}
                          </span>
                        </div>
                      </div>

                      {/* Gig Description */}
                      <p className="text-[#A8E8F9] text-sm mb-4 line-clamp-3 grow">
                        {gig.description}
                      </p>

                      {/* Gig Details */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-1 text-[#A8E8F9] text-xs px-2 py-1 bg-[#00537A] rounded">
                          <FiClock size={10} />
                          <span>{getTimeAgo(gig.createdAt)}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                          gig.status === 'open'
                            ? 'bg-green-400/20 text-green-400'
                            : 'bg-[#F5A201]/20 text-[#F5A201]'
                        }`}>
                          {gig.status === 'open' ? <FiClock size={10} /> : <FiCheckCircle size={10} />}
                          <span className="capitalize">{gig.status}</span>
                        </div>
                        {gig.location && (
                          <div className="flex items-center gap-1 text-[#A8E8F9] text-xs px-2 py-1 bg-[#00537A] rounded">
                            <FiMapPin size={10} />
                            <span>{gig.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Bid Count & Action Button */}
                      <div className="flex justify-between items-center pt-4 border-t border-[#00537A]">
                        <div className="flex items-center gap-2">
                          <div className="text-[#A8E8F9] text-sm">
                            <span className="font-semibold">{gig.bidCount || 0}</span>
                            <span className="ml-1">{gig.bidCount === 1 ? 'bid' : 'bids'}</span>
                          </div>
                          {gig.avgRating > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <FiStar className="text-[#F5A201]" size={10} />
                              <span className="text-[#A8E8F9]">{gig.avgRating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        
                        {user ? (
                          user.id === gig.ownerId?._id ? (
                            <Link
                              to={`/gigs/${gig._id}/bids`}
                              className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2"
                            >
                              View Bids
                            </Link>
                          ) : (
                            // Replace the "Place Bid" button in BrowseGigs.jsx
<Link
  to={`/post-bid/${gig._id}`}
  state={{ gig }} // Pass gig data in state
  className="w-full btn-primary text-sm py-2 flex items-center justify-center gap-2"
>
  <FiDollarSign />
  Place Bid
</Link>
                          )
                        ) : (
                          <Link
                            to="/login"
                            className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 py-2"
                          >
                            Login to Bid
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#00537A]">
                  <p className="text-[#A8E8F9] text-sm">
                    Page {page} of {totalPages}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="p-2 rounded-lg bg-[#00537A] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00537A]/80 transition-colors touch-target"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft />
                    </button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (page <= 3) {
                          pageNum = i + 1
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = page - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-10 h-10 rounded-lg transition-colors text-sm ${
                              page === pageNum
                                ? 'gradient-bg text-[#013C58] font-semibold'
                                : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg bg-[#00537A] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00537A]/80 transition-colors touch-target"
                      aria-label="Next page"
                    >
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}