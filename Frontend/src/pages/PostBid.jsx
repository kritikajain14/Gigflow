import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
// import axios from 'axios'
import api from '../services/api'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import {
  FiDollarSign,
  FiMessageSquare,
  FiUpload,
  FiArrowLeft,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiPercent,
  FiLoader
} from 'react-icons/fi'

export default function PostBid() {
  const { id: gigId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    price: '',
    message: '',
    deliveryTime: '7', // days
    revisions: '1'
  })
  const [errors, setErrors] = useState({})
  const [hasExistingBid, setHasExistingBid] = useState(false)
  const { user } = useAuth()
  const { showNotification } = useNotification()

  // Get gig from location state or fetch from API
  useEffect(() => {
    const fetchGigData = async () => {
      try {
        setLoading(true)
        
        // If gig data is passed in location state, use it
        if (location.state?.gig) {
          setGig(location.state.gig)
        } else {
          // Otherwise fetch from API
          const response = await api.get(`/gigs/${gigId}`, {
            // withCredentials: true
          })
          if (response.data.success) {
            setGig(response.data.gig)
          } else {
            throw new Error('Gig not found')
          }
        }

        // Check if user already has a bid on this gig
        const bidResponse = await api.get('/bids/my-bids', {
          // withCredentials: true
        })
        
        if (bidResponse.data.success) {
          const existingBid = bidResponse.data.bids.find(bid => bid.gigId?._id === gigId)
          if (existingBid) {
            setHasExistingBid(true)
            setFormData({
              price: existingBid.price.toString(),
              message: existingBid.message,
              deliveryTime: '7',
              revisions: '1'
            })
            showNotification('You already have a bid on this gig. You can update it below.', 'info')
          }
        }

        // Pre-fill price with a suggested amount (80% of budget)
        if (!location.state?.gig?.price) {
          const suggestedPrice = Math.floor(gig?.budget * 0.8)
          setFormData(prev => ({
            ...prev,
            price: suggestedPrice.toString()
          }))
        }

      } catch (error) {
        console.error('Error fetching gig:', error)
        showNotification('Failed to load gig details', 'error')
        navigate('/gigs')
      } finally {
        setLoading(false)
      }
    }

    fetchGigData()
  }, [gigId, navigate, showNotification, location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price < 1) {
        newErrors.price = 'Price must be at least $1'
      } else if (gig && price > gig.budget) {
        newErrors.price = `Price cannot exceed gig budget ($${gig.budget})`
      }
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Proposal message is required'
    } else if (formData.message.length < 20) {
      newErrors.message = 'Proposal must be at least 20 characters'
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Proposal cannot exceed 1000 characters'
    }
    
    if (!formData.deliveryTime.trim()) {
      newErrors.deliveryTime = 'Delivery time is required'
    } else {
      const days = parseInt(formData.deliveryTime)
      if (isNaN(days) || days < 1) {
        newErrors.deliveryTime = 'Delivery time must be at least 1 day'
      } else if (days > 365) {
        newErrors.deliveryTime = 'Delivery time cannot exceed 365 days'
      }
    }
    
    if (!formData.revisions.trim()) {
      newErrors.revisions = 'Number of revisions is required'
    } else {
      const revisions = parseInt(formData.revisions)
      if (isNaN(revisions) || revisions < 0) {
        newErrors.revisions = 'Revisions must be 0 or more'
      } else if (revisions > 10) {
        newErrors.revisions = 'Revisions cannot exceed 10'
      }
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      showNotification('Please fix the errors in the form', 'error')
      return
    }
    
    setSubmitting(true)

    try {
      const bidData = {
        gigId,
        price: parseFloat(formData.price),
        message: formData.message,
        deliveryTime: parseInt(formData.deliveryTime),
        revisions: parseInt(formData.revisions)
      }

      const response = await api.post('/bids', bidData, {
        // withCredentials: true
      })

      if (response.data.success) {
        showNotification(
          hasExistingBid 
            ? 'Bid updated successfully!' 
            : 'Bid submitted successfully!',
          'success'
        )
        navigate('/my-bids')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error submitting bid'
      showNotification(message, 'error')
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const calculateSavings = () => {
    if (!gig || !formData.price) return 0
    const price = parseFloat(formData.price)
    if (isNaN(price)) return 0
    return Math.max(0, gig.budget - price)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const deliveryOptions = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '30', label: '1 month' },
    { value: '60', label: '2 months' },
    { value: '90', label: '3 months' }
  ]

  const revisionOptions = [
    { value: '0', label: 'No revisions' },
    { value: '1', label: '1 revision' },
    { value: '2', label: '2 revisions' },
    { value: '3', label: '3 revisions' },
    { value: '5', label: '5 revisions' },
    { value: 'unlimited', label: 'Unlimited revisions' }
  ]

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-4xl text-[#F5A201] mb-4" />
          <p className="text-[#A8E8F9]">Loading gig details...</p>
        </div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-[#A8E8F9]">🔍</div>
          <h3 className="text-xl font-semibold mb-2 text-white">Gig not found</h3>
          <p className="text-[#A8E8F9] mb-6">The gig you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/gigs')}
            className="btn-primary"
          >
            Browse Other Gigs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#A8E8F9] hover:text-[#F5A201] mb-6 transition-colors text-sm sm:text-base"
      >
        <FiArrowLeft />
        <span>Back to Gig</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Gig Details */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-4 sm:p-6 mb-6"
          >
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                {hasExistingBid ? 'Update Your Bid' : 'Submit Your Bid'}
              </h1>
              <p className="text-[#A8E8F9] text-sm sm:text-base">
                {hasExistingBid 
                  ? 'Update your proposal for this gig'
                  : 'Make your proposal stand out from the competition'
                }
              </p>
            </div>

            {/* Gig Info Card */}
            <div className="glass-light rounded-2xl p-4 sm:p-6 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {gig.title}
                  </h2>
                  <p className="text-[#A8E8F9] text-sm mb-4 line-clamp-3">
                    {gig.description}
                  </p>
                </div>
                <div className="px-3 py-1 gradient-bg rounded-full shrink-0">
                  <span className="text-[#013C58] font-semibold text-sm">
                    {formatCurrency(gig.budget)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-[#A8E8F9] text-sm">
                  <FiUser />
                  <span className="truncate">{gig.ownerId?.name || 'Client'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#A8E8F9] text-sm">
                  <FiBriefcase />
                  <span>Budget</span>
                </div>
                <div className="flex items-center gap-2 text-[#A8E8F9] text-sm">
                  <FiClock />
                  <span>{gig.status === 'open' ? 'Open' : 'Closed'}</span>
                </div>
                <div className="flex items-center gap-2 text-[#A8E8F9] text-sm">
                  <FiCalendar />
                  <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Bid Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Price Field */}
              <div>
                <label className="text-white mb-2 font-medium text-sm sm:text-base flex items-center gap-2">
                  <FiDollarSign />
                  <span>Your Price *</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]">
                    $
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="500"
                    className={`form-input pl-10 ${errors.price ? 'border-red-400' : ''}`}
                    min="1"
                    step="1"
                    disabled={submitting}
                  />
                  {errors.price && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FiAlertCircle className="text-red-400" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  {errors.price ? (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <FiAlertCircle size={12} />
                      {errors.price}
                    </p>
                  ) : (
                    <p className="text-sm text-[#A8E8F9]">
                      Enter your total price for this project
                    </p>
                  )}
                  <div className="text-sm text-[#A8E8F9]">
                    Budget: {formatCurrency(gig.budget)}
                  </div>
                </div>
                
                {/* Price Insights */}
                {formData.price && !errors.price && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="glass-light rounded-xl p-3">
                      <div className="text-xs text-[#A8E8F9] mb-1">Your Price</div>
                      <div className="text-lg font-bold text-white">
                        {formatCurrency(parseFloat(formData.price))}
                      </div>
                    </div>
                    <div className="glass-light rounded-xl p-3">
                      <div className="text-xs text-[#A8E8F9] mb-1">Client Saves</div>
                      <div className="text-lg font-bold text-green-400">
                        {formatCurrency(calculateSavings())}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time */}
              <div>
                <label className="text-white mb-2 font-medium text-sm sm:text-base flex items-center gap-2">
                  <FiClock />
                  <span>Delivery Time *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {deliveryOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, deliveryTime: option.value }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.deliveryTime === option.value
                          ? 'bg-[#F5A201] text-[#013C58] font-medium'
                          : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
                      }`}
                      disabled={submitting}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.deliveryTime && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.deliveryTime}
                  </p>
                )}
              </div>

              {/* Revisions */}
              <div>
                <label className="text-white mb-2 font-medium text-sm sm:text-base flex items-center gap-2">
                  <FiPercent />
                  <span>Number of Revisions *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {revisionOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, revisions: option.value }))}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        formData.revisions === option.value
                          ? 'bg-[#F5A201] text-[#013C58] font-medium'
                          : 'bg-[#00537A] text-white hover:bg-[#00537A]/80'
                      }`}
                      disabled={submitting}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.revisions && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.revisions}
                  </p>
                )}
              </div>

              {/* Proposal Message */}
              <div>
                <label className="text-white mb-2 font-medium text-sm sm:text-base flex items-center gap-2">
                  <FiMessageSquare />
                  <span>Your Proposal *</span>
                </label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe how you'll approach this project, your relevant experience, and why you're the best fit. Be specific about your process and deliverables."
                    className={`form-input min-h-37.5 resize-none ${errors.message ? 'border-red-400' : ''}`}
                    maxLength={1000}
                    disabled={submitting}
                  />
                  {errors.message && (
                    <div className="absolute right-3 top-3">
                      <FiAlertCircle className="text-red-400" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  {errors.message ? (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <FiAlertCircle size={12} />
                      {errors.message}
                    </p>
                  ) : (
                    <p className="text-sm text-[#A8E8F9]">
                      Explain why you're the perfect fit for this project
                    </p>
                  )}
                  <span className={`text-sm ${formData.message.length > 900 ? 'text-red-400' : 'text-[#A8E8F9]'}`}>
                    {formData.message.length}/1000
                  </span>
                </div>
              </div>

              {/* Tips for a Great Bid */}
              <div className="glass-light rounded-2xl p-4 sm:p-6">
                <h3 className="font-semibold text-[#F5A201] mb-3 text-sm sm:text-base flex items-center gap-2">
                  <FiInfo />
                  Tips for a winning bid:
                </h3>
                <ul className="text-sm text-[#A8E8F9] space-y-2">
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                    <span>Address the client's specific requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                    <span>Highlight relevant experience and past work</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                    <span>Be clear about your process and timeline</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                    <span>Explain why you're uniquely qualified</span>
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#00537A]">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn-secondary px-6 py-3 text-sm sm:text-base"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-6 py-3 text-sm sm:text-base flex-1 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FiUpload />
                      <span>{hasExistingBid ? 'Update Bid' : 'Submit Bid'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Right Column - Bid Summary & Tips */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Bid Summary Card */}
            <div className="glass rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-4 text-lg">Bid Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#A8E8F9] text-sm">Your Price</span>
                  <span className="text-white font-medium">
                    {formData.price ? formatCurrency(parseFloat(formData.price)) : '$0'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#A8E8F9] text-sm">Delivery Time</span>
                  <span className="text-white font-medium">
                    {formData.deliveryTime ? 
                      deliveryOptions.find(opt => opt.value === formData.deliveryTime)?.label || 
                      `${formData.deliveryTime} days` : 
                      'Not set'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[#A8E8F9] text-sm">Revisions</span>
                  <span className="text-white font-medium">
                    {formData.revisions ? 
                      revisionOptions.find(opt => opt.value === formData.revisions)?.label || 
                      `${formData.revisions} revisions` : 
                      'Not set'
                    }
                  </span>
                </div>
                
                <div className="pt-4 border-t border-[#00537A]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#A8E8F9] text-sm">Gig Budget</span>
                    <span className="text-white font-medium">
                      {formatCurrency(gig.budget)}
                    </span>
                  </div>
                  
                  {formData.price && !errors.price && (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#A8E8F9] text-sm">Client Saves</span>
                        <span className="text-green-400 font-medium">
                          {formatCurrency(calculateSavings())}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#A8E8F9] text-sm">Your Earnings</span>
                        <span className="text-[#F5A201] font-medium">
                          {formatCurrency(parseFloat(formData.price))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* What Clients Look For */}
            <div className="glass rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-white mb-4 text-lg flex items-center gap-2">
                <FiInfo />
                What Clients Look For
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#F5A201]/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#F5A201] text-xs font-bold">1</span>
                  </div>
                  <p className="text-sm text-[#A8E8F9]">
                    <span className="font-medium text-white">Clear Communication:</span> Show you understand the requirements
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#F5A201]/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#F5A201] text-xs font-bold">2</span>
                  </div>
                  <p className="text-sm text-[#A8E8F9]">
                    <span className="font-medium text-white">Relevant Experience:</span> Provide examples of similar work
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#F5A201]/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#F5A201] text-xs font-bold">3</span>
                  </div>
                  <p className="text-sm text-[#A8E8F9]">
                    <span className="font-medium text-white">Realistic Timeline:</span> Set achievable delivery expectations
                  </p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-[#F5A201]/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-[#F5A201] text-xs font-bold">4</span>
                  </div>
                  <p className="text-sm text-[#A8E8F9]">
                    <span className="font-medium text-white">Competitive Pricing:</span> Offer fair value for the scope
                  </p>
                </div>
              </div>
            </div>

            {/* Success Rate Card */}
            <div className="glass rounded-2xl p-4 sm:p-6">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">85%</div>
                <p className="text-[#A8E8F9] text-sm mb-4">
                  of detailed proposals get a response
                </p>
                <div className="w-full bg-[#00537A] rounded-full h-2">
                  <div 
                    className="gradient-bg rounded-full h-2 transition-all duration-500"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-xs text-[#A8E8F9] mt-3">
                  Detailed bids with clear proposals have higher acceptance rates
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}