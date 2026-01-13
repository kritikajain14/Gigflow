import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
// import axios from 'axios'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useNotification } from '../context/NotificationContext'
import {
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiCheck,
  FiX,
  FiLoader,
  FiArrowLeft,
  FiMessageSquare,
  FiMail,
  FiStar,
  FiAlertCircle,
  FiExternalLink,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiAward
} from 'react-icons/fi'
import api from '../services/api'

export default function GigBids() {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const [bids, setBids] = useState([])
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hiring, setHiring] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [expandedBid, setExpandedBid] = useState(null)
  const { showNotification } = useNotification()

  useEffect(() => {
    fetchBids()
  }, [gigId])

  const fetchBids = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/bids/${gigId}`, {
        withCredentials: true
      })

      if (response.data.success) {
        setBids(response.data.bids)
        if (response.data.bids.length > 0) {
  const gigResponse = await api.get(`/gigs/${gigId}`, {
    withCredentials: true
  })
          if (gigResponse.data.success) {
            setGig(gigResponse.data.gig)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching bids:', error)
      showNotification('Error fetching bids', 'error')
      navigate('/my-gigs')
    } finally {
      setLoading(false)
    }
  }

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) return

    setHiring(bidId)

    try {
      const response = await api.patch(
        `/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      )

      if (response.data.success) {
        showNotification('Freelancer hired successfully! They have been notified.', 'success')
        fetchBids()
      }
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Error hiring freelancer',
        'error'
      )
    } finally {
      setHiring(null)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'hired':
        return <FiCheck className="text-green-400" />
      case 'rejected':
        return <FiX className="text-red-400" />
      default:
        return <FiClock className="text-yellow-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'hired':
        return 'border-green-400 bg-green-400/10'
      case 'rejected':
        return 'border-red-400 bg-red-400/10'
      default:
        return ''
    }
  }

  const getFilteredBids = () => {
    let filtered = bids
    
    if (filter !== 'all') {
      filtered = filtered.filter(bid => bid.status === filter)
    }
    
    // Sort bids
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    
    return filtered
  }

  const filteredBids = getFilteredBids()

  const toggleExpandBid = (bidId) => {
    setExpandedBid(expandedBid === bidId ? null : bidId)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-[#F5A201] mb-4" />
          <p className="text-[#A8E8F9]">Loading bids...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/my-gigs')}
        className="flex items-center gap-2 text-[#A8E8F9] hover:text-[#F5A201] mb-6 transition-colors text-sm sm:text-base"
      >
        <FiArrowLeft />
        <span>Back to My Gigs</span>
      </button>

      {/* Gig Info */}
      {gig && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {gig.title}
              </h1>
              <p className="text-[#A8E8F9] text-sm sm:text-base mb-4 line-clamp-3">
                {gig.description}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="px-3 py-1 gradient-bg rounded-full text-sm">
                  <span className="text-[#013C58] font-semibold">
                    {formatCurrency(gig.budget)}
                  </span>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  gig.status === 'open'
                    ? 'bg-green-400/20 text-green-400'
                    : 'bg-[#F5A201]/20 text-[#F5A201]'
                }`}>
                  Status: {gig.status}
                </div>
                <div className="px-3 py-1 bg-[#00537A] rounded-full text-sm text-white">
                  {bids.length} {bids.length === 1 ? 'bid' : 'bids'} received
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Bids Received ({bids.length})
        </h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#00537A] text-white text-sm rounded-lg px-3 py-2 border border-[#00537A] focus:outline-none focus:ring-2 focus:ring-[#F5A201]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          
          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#00537A] text-white text-sm rounded-lg px-3 py-2 border border-[#00537A] focus:outline-none focus:ring-2 focus:ring-[#F5A201]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Lowest Price</option>
            <option value="price-high">Highest Price</option>
          </select>
        </div>
      </div>

      {/* Bids List */}
      {filteredBids.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <div className="text-6xl mb-4 text-[#A8E8F9]">
            {filter === 'all' ? '📨' : filter === 'hired' ? '🎉' : filter === 'rejected' ? '😞' : '⏳'}
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
            {filter === 'all' ? 'No bids yet' :
             filter === 'pending' ? 'No pending bids' :
             filter === 'hired' ? 'No hired freelancers' :
             'No rejected bids'}
          </h3>
          <p className="text-[#A8E8F9] mb-6 max-w-md mx-auto">
            {filter === 'all' ? 'Check back later or share your gig to get more visibility' :
             filter === 'pending' ? 'All bids have been processed' :
             filter === 'hired' ? 'You haven\'t hired anyone for this gig yet' :
             'No bids have been rejected'}
          </p>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="btn-secondary"
            >
              Show All Bids
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid, index) => (
            <motion.div
              key={bid._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`card-glass p-4 sm:p-6 ${getStatusColor(bid.status)} ${
                bid.status === 'hired' ? 'border-2 border-green-400' : ''
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Bidder Info */}
                <div className="grow">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#00537A] rounded-2xl flex items-center justify-center shrink-0">
                      <div className="text-xl sm:text-2xl font-bold text-white">
                        {bid.freelancerId?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    </div>
                    <div className="grow min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">
                            {bid.freelancerId?.name || 'Unknown Freelancer'}
                          </h3>
                          <p className="text-sm text-[#A8E8F9] flex items-center gap-1">
                            <FiMail size={12} />
                            {bid.freelancerId?.email || 'No email provided'}
                          </p>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-[#F5A201]">
                          {formatCurrency(bid.price)}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[#A8E8F9] mb-3">
                        <div className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          {formatDate(bid.createdAt)}
                        </div>
                        <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${
                          bid.status === 'hired' ? 'bg-green-400/20 text-green-400' :
                          bid.status === 'rejected' ? 'bg-red-400/20 text-red-400' :
                          'bg-yellow-400/20 text-yellow-400'
                        }`}>
                          {getStatusIcon(bid.status)}
                          <span className="capitalize">{bid.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bid Message */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-[#F5A201] mb-2">
                      <FiMessageSquare />
                      <span className="font-medium text-sm sm:text-base">Proposal</span>
                    </div>
                    <div className="glass-light rounded-xl p-3 sm:p-4">
                      <p className="text-[#A8E8F9] text-sm sm:text-base">
                        {expandedBid === bid._id || bid.message.length < 300 
                          ? bid.message 
                          : `${bid.message.substring(0, 300)}...`
                        }
                      </p>
                      {bid.message.length > 300 && (
                        <button
                          onClick={() => toggleExpandBid(bid._id)}
                          className="mt-2 text-[#F5A201] hover:text-white text-sm flex items-center gap-1"
                        >
                          {expandedBid === bid._id ? (
                            <>
                              <FiChevronUp />
                              Show Less
                            </>
                          ) : (
                            <>
                              <FiChevronDown />
                              Read More
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 lg:w-48">
                  {/* <p className="text-xs text-yellow-400">
  gigStatus: {gig?.status} | bidStatus: {bid.status}
</p> */}

                  {gig && gig.status === 'open' && bid.status === 'pending' && (
                    <button
                      onClick={() => handleHire(bid._id)}
                      disabled={hiring === bid._id}
                      className="btn-primary flex items-center justify-center gap-2 text-sm py-3"
                    >
                      {hiring === bid._id ? (
                        <>
                          <FiLoader className="animate-spin" />
                          <span>Hiring...</span>
                        </>
                      ) : (
                        <>
                          <FiAward />
                          <span>Hire Now</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {bid.status === 'hired' && (
                    <div className="px-4 py-3 bg-green-400/20 text-green-400 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <FiAward />
                        <span className="font-medium">Hired</span>
                      </div>
                      <p className="text-xs text-center">
                        Freelancer hired successfully
                      </p>
                    </div>
                  )}
                  
                  {bid.status === 'rejected' && (
                    <div className="px-4 py-3 bg-red-400/20 text-red-400 rounded-lg">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <FiX />
                        <span className="font-medium">Rejected</span>
                      </div>
                      <p className="text-xs text-center">
                        Bid was not selected
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-[#A8E8F9] mt-2 text-center">
                    <p>Budget: {formatCurrency(gig?.budget)}</p>
                    <p className="mt-1">Submitted {formatDate(bid.createdAt)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}