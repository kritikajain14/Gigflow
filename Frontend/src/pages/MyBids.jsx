import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useNotification } from '../context/NotificationContext'
import {
  FiBriefcase,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiLoader,
  FiSearch,
  FiAlertCircle,
  FiExternalLink,
  FiFilter,
  FiMessageSquare,
  FiUser
} from 'react-icons/fi'

export default function MyBids() {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    hired: 0,
    rejected: 0
  })
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchMyBids()
  }, [])

  const fetchMyBids = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/bids/my-bids', {
        withCredentials: true
      })

      if (response.data.success) {
        const bidsData = response.data.bids
        setBids(bidsData)
        
        const statsData = {
          total: bidsData.length,
          pending: bidsData.filter(b => b.status === 'pending').length,
          hired: bidsData.filter(b => b.status === 'hired').length,
          rejected: bidsData.filter(b => b.status === 'rejected').length
        }
        setStats(statsData)
      }
    } catch (error) {
      console.error('Error fetching bids:', error)
      showNotification('Failed to load your bids', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawBid = async (bidId, gigTitle) => {
    if (!window.confirm(`Are you sure you want to withdraw your bid for "${gigTitle}"?`)) return

    try {
      await axios.delete(`/api/bids/${bidId}`, {
        withCredentials: true
      })
      showNotification('Bid withdrawn successfully', 'success')
      fetchMyBids()
    } catch (error) {
      showNotification('Failed to withdraw bid', 'error')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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
      case 'hired':
        return 'bg-green-400/20 text-green-400'
      case 'rejected':
        return 'bg-red-400/20 text-red-400'
      default:
        return 'bg-yellow-400/20 text-yellow-400'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hired':
        return <FiCheckCircle className="text-green-400" />
      case 'rejected':
        return <FiXCircle className="text-red-400" />
      default:
        return <FiClock className="text-yellow-400" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'hired':
        return 'Congratulations! You got hired'
      case 'rejected':
        return 'Bid was not selected'
      default:
        return 'Waiting for client response'
    }
  }

  const getFilteredBids = () => {
    let filtered = bids
    
    if (search) {
      filtered = filtered.filter(bid => 
        bid.gigId?.title?.toLowerCase().includes(search.toLowerCase()) ||
        bid.message?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    if (filter !== 'all') {
      filtered = filtered.filter(bid => bid.status === filter)
    }
    
    return filtered
  }

  const filteredBids = getFilteredBids()

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          My <span className="gradient-text">Bids</span>
        </h1>
        <p className="text-[#A8E8F9] text-sm">
          Track all your submitted bids and their status
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bids by gig title or message..."
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
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Total Bids</div>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-yellow-400 mb-1">
            {stats.pending}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Pending</div>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
            {stats.hired}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Hired</div>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-red-400 mb-1">
            {stats.rejected}
          </div>
          <div className="text-xs sm:text-sm text-[#A8E8F9]">Rejected</div>
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
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'pending'
              ? 'bg-[#F5A201] text-[#013C58] font-medium'
              : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('hired')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'hired'
              ? 'bg-[#F5A201] text-[#013C58] font-medium'
              : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
          }`}
        >
          Hired
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            filter === 'rejected'
              ? 'bg-[#F5A201] text-[#013C58] font-medium'
              : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FiLoader className="animate-spin text-4xl text-[#F5A201] mb-4" />
          <p className="text-[#A8E8F9]">Loading your bids...</p>
        </div>
      ) : filteredBids.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="text-6xl mb-4 text-[#A8E8F9]">
            {search || filter !== 'all' ? '🔍' : '📤'}
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
            {search ? 'No matching bids found' : 'No bids submitted yet'}
          </h3>
          <p className="text-[#A8E8F9] mb-6 max-w-md mx-auto">
            {search 
              ? 'Try a different search term or clear filters'
              : 'Start bidding on gigs to showcase your skills and get hired'
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
            <Link to="/gigs" className="btn-primary flex items-center gap-2">
              <FiSearch />
              <span>Browse Available Gigs</span>
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Bids Count */}
          <div className="mb-4">
            <p className="text-[#A8E8F9] text-sm">
              Showing {filteredBids.length} {filteredBids.length === 1 ? 'bid' : 'bids'}
              {search && ` for "${search}"`}
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>

          {/* Bids Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredBids.map((bid, index) => (
              <motion.div
                key={bid._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card-glass hover:shadow-[0_0_20px_rgba(245,162,1,0.1)] ${
                  bid.status === 'hired' ? 'border-2 border-green-400' : ''
                }`}
              >
                <div className="p-4 sm:p-6">
                  {/* Bid Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(bid.status)}
                        <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(bid.status)}`}>
                          <span className="capitalize">{bid.status}</span>
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
                        {bid.gigId?.title || 'Gig not found'}
                      </h3>
                      <div className="flex items-center gap-2 text-[#A8E8F9] text-sm mb-3">
                        <FiUser size={12} />
                        <span>Client: {bid.gigId?.ownerId?.name || 'Unknown'}</span>
                      </div>
                      <div className="glass-light rounded-xl p-3">
                        <div className="flex items-center gap-2 text-[#F5A201] text-sm mb-1">
                          <FiMessageSquare />
                          <span className="font-medium">Your Proposal</span>
                        </div>
                        <p className="text-[#A8E8F9] text-sm line-clamp-3">
                          {bid.message}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 shrink-0">
                      <div className="text-xl sm:text-2xl font-bold text-[#F5A201] mb-1">
                        {formatCurrency(bid.price)}
                      </div>
                      <div className="text-xs text-[#A8E8F9] text-center">
                        Your Bid
                      </div>
                    </div>
                  </div>

                  {/* Status Message */}
                  <div className="mb-4">
                    <p className={`text-sm flex items-center gap-2 ${
                      bid.status === 'hired' ? 'text-green-400' :
                      bid.status === 'rejected' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      {getStatusIcon(bid.status)}
                      {getStatusText(bid.status)}
                    </p>
                  </div>

                  {/* Bid Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#00537A]">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-[#A8E8F9]">
                        {formatDate(bid.createdAt)}
                      </div>
                      <div className="px-3 py-1 bg-[#00537A] rounded-full text-xs">
                        Budget: {formatCurrency(bid.gigId?.budget || 0)}
                      </div>
                      {bid.gigId?.status === 'open' && bid.status === 'pending' && (
                        <div className="relative">
                          <div className="w-2 h-2 bg-[#F5A201] rounded-full animate-ping"></div>
                          <div className="absolute top-0 left-0 w-2 h-2 bg-[#F5A201] rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {bid.status === 'pending' && (
                        <button
                          onClick={() => handleWithdrawBid(bid._id, bid.gigId?.title)}
                          className="px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-1"
                          title="Withdraw bid"
                        >
                          <FiAlertCircle size={14} />
                          <span className="hidden sm:inline">Withdraw</span>
                        </button>
                      )}
                      <Link
                        to={`/gigs/${bid.gigId?._id}`}
                        className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
                      >
                        <FiExternalLink size={14} />
                        <span className="hidden sm:inline">View Gig</span>
                        <span className="sm:hidden">View</span>
                      </Link>
                    </div>
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