import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useNotification } from '../context/NotificationContext'
import {
  FiEye,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiLoader,
  FiCheckCircle,
  FiClock,
  FiPlus,
  FiAlertCircle,
  FiMessageSquare,
  FiEdit2,
  FiTrash2,
  FiFilter,
  FiSearch
} from 'react-icons/fi'

export default function MyGigs() {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    assigned: 0,
    totalBids: 0
  })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchMyGigs()
  }, [])

  const fetchMyGigs = async () => {
    try {
      setLoading(true)
      const response = await api.get('/gigs/my-gigs', {
        withCredentials: true
      })

      if (response.data.success) {
        const gigsData = response.data.gigs
        setGigs(gigsData)
        
        const statsData = {
          total: gigsData.length,
          open: gigsData.filter(g => g.status === 'open').length,
          assigned: gigsData.filter(g => g.status === 'assigned').length,
          totalBids: gigsData.reduce((sum, g) => sum + (g.bidCount || 0), 0)
        }
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching gigs:', error)
      showNotification('Failed to load your gigs', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGig = async (gigId, gigTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${gigTitle}"? This action cannot be undone.`)) return

    try {
      await api.delete(`/gigs/${gigId}`, {
        withCredentials: true
      })
      showNotification('Gig deleted successfully', 'success')
      fetchMyGigs()
    } catch (error) {
      showNotification('Failed to delete gig', 'error')
    }
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-green-400/20 text-green-400'
      case 'open':
        return 'bg-[#F5A201]/20 text-[#F5A201]'
      default:
        return 'bg-[#A8E8F9]/20 text-[#A8E8F9]'
    }
  }

  const getFilteredGigs = () => {
    let filtered = gigs
    
    if (search) {
      filtered = filtered.filter(gig => 
        gig.title.toLowerCase().includes(search.toLowerCase()) ||
        gig.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (filter !== 'all') {
      filtered = filtered.filter(gig => gig.status === filter)
    }
    
    return filtered
  }

  const filteredGigs = getFilteredGigs()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            My <span className="gradient-text">Gigs</span>
          </h1>
          <p className="text-[#A8E8F9] text-sm">
            Manage your posted gigs and review bids
          </p>
        </div>
        <Link to="/post-gig" className="btn-primary flex items-center justify-center gap-2">
          <FiPlus />
          <span className="hidden sm:inline">Post New Gig</span>
          <span className="sm:hidden">Post</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your gigs..."
            className="form-input pl-12"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-white mb-1">
            {stats.total}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Total Gigs</div>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
            {stats.open}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Open</div>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-[#F5A201] mb-1">
            {stats.assigned}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Assigned</div>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-[#A8E8F9] mb-1">
            {stats.totalBids}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Total Bids</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'all'
              ? 'bg-[#F5A201] text-[#013C58] font-medium'
              : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'open'
              ? 'bg-[#F5A201] text-[#013C58] font-medium'
              : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
          }`}
        >
          Open
        </button>
        <button
          onClick={() => setFilter('assigned')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'assigned'
              ? 'bg-[#F5A201] text-[#013C58] font-medium'
              : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
          }`}
        >
          Assigned
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-[#F5A201] mb-4" />
          <p className="text-[#A8E8F9]">Loading your gigs...</p>
        </div>
      ) : filteredGigs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="text-6xl mb-4 text-[#A8E8F9]">
            {search || filter !== 'all' ? '🔍' : '📋'}
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
            {search ? 'No matching gigs found' : 'No gigs posted yet'}
          </h3>
          <p className="text-[#A8E8F9] mb-6 max-w-md mx-auto">
            {search 
              ? 'Try a different search term or clear filters'
              : 'Start by posting your first gig to find talented freelancers'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {(search || filter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setFilter('all') }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
            <Link to="/post-gig" className="btn-primary">
              Post Your First Gig
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Gigs Count */}
          <div className="mb-4">
            <p className="text-[#A8E8F9] text-sm">
              Showing {filteredGigs.length} {filteredGigs.length === 1 ? 'gig' : 'gigs'}
              {search && ` for "${search}"`}
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>

          {/* Gigs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredGigs.map((gig, index) => (
              <motion.div
                key={gig._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-glass hover:shadow-[0_0_20px_rgba(245,162,1,0.1)]"
              >
                <div className="p-4 sm:p-6">
                  {/* Gig Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(gig.status)}`}>
                          {gig.status === 'open' ? <FiClock size={10} /> : <FiCheckCircle size={10} />}
                          <span className="capitalize">{gig.status}</span>
                        </div>
                        {gig.status === 'open' && gig.bidCount > 0 && (
                          <div className="relative">
                            <div className="w-2 h-2 bg-[#F5A201] rounded-full animate-ping"></div>
                            <div className="absolute top-0 left-0 w-2 h-2 bg-[#F5A201] rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
                        {gig.title}
                      </h3>
                      <p className="text-[#A8E8F9] text-sm line-clamp-2 mb-4">
                        {gig.description}
                      </p>
                    </div>
                    <div className="px-2 py-1 gradient-bg rounded-full ml-2 shrink-0">
                      <span className="text-[#013C58] font-semibold text-sm">
                        {formatCurrency(gig.budget)}
                      </span>
                    </div>
                  </div>

                  {/* Gig Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-2 bg-[#00537A]/30 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-[#A8E8F9] mb-1">
                        {gig.bidCount || 0}
                      </div>
                      <div className="text-xs text-[#A8E8F9] flex items-center justify-center gap-1">
                        <FiMessageSquare size={10} />
                        Bids
                      </div>
                    </div>
                    <div className="text-center p-2 bg-[#00537A]/30 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-[#F5A201] mb-1">
                        {gig.status === 'assigned' ? '1' : '0'}
                      </div>
                      <div className="text-xs text-[#A8E8F9] flex items-center justify-center gap-1">
                        <FiUsers size={10} />
                        Hired
                      </div>
                    </div>
                    <div className="text-center p-2 bg-[#00537A]/30 rounded-lg">
                      <div className="text-lg sm:text-xl font-bold text-green-400 mb-1">
                        {formatDate(gig.createdAt)}
                      </div>
                      <div className="text-xs text-[#A8E8F9] flex items-center justify-center gap-1">
                        <FiCalendar size={10} />
                        Posted
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-[#00537A]">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteGig(gig._id, gig.title)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex-1 sm:flex-none"
                        title="Delete gig"
                      >
                        <FiTrash2 />
                      </button>
                      <button
                        onClick={() => navigate(`/edit-gig/${gig._id}`)}
                        className="p-2 text-[#A8E8F9] hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-1 sm:flex-none"
                        title="Edit gig"
                      >
                        <FiEdit2 />
                      </button>
                    </div>
                    <Link
                      to={`/gigs/${gig._id}/bids`}
                      className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <FiEye />
                      <span>View Bids ({gig.bidCount || 0})</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}