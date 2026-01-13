import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
import { motion } from 'framer-motion'
import { useNotification } from '../context/NotificationContext'
import { FiType, FiFileText, FiDollarSign, FiUpload, FiAlertCircle, FiGlobe, FiCalendar, FiTag } from 'react-icons/fi'
import api from '../services/api'

export default function PostGig() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: '',
    location: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const { showNotification } = useNotification()

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design & Creative',
    'Writing & Translation',
    'Digital Marketing',
    'Video & Animation',
    'Music & Audio',
    'Business',
    'Data Science',
    'Other'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters'
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters'
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required'
    } else {
      const budget = parseFloat(formData.budget)
      if (isNaN(budget) || budget < 1) {
        newErrors.budget = 'Budget must be at least $1'
      } else if (budget > 1000000) {
        newErrors.budget = 'Budget cannot exceed $1,000,000'
      }
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (deadlineDate < today) {
        newErrors.deadline = 'Deadline cannot be in the past'
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
    
    setLoading(true)

    try {
      const response = await api.post('/api/gigs', {
        ...formData,
        budget: parseFloat(formData.budget)
      }, {
        withCredentials: true
      })

      if (response.data.success) {
        showNotification('Gig posted successfully!', 'success')
        navigate('/my-gigs')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error posting gig'
      showNotification(message, 'error')
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              Post a <span className="gradient-text">New Gig</span>
            </h1>
            <p className="text-[#A8E8F9] text-sm sm:text-base">
              Describe your project and get bids from talented freelancers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base items-center gap-2">
                <FiType />
                <span>Project Title *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Build a React E-commerce Website"
                  className={`form-input ${errors.title ? 'border-red-400' : ''}`}
                  maxLength={100}
                  disabled={loading}
                />
                {errors.title && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <FiAlertCircle className="text-red-400" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                {errors.title ? (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.title}
                  </p>
                ) : (
                  <p className="text-sm text-[#A8E8F9]">
                    Be specific about what you need
                  </p>
                )}
                <span className={`text-sm ${formData.title.length > 90 ? 'text-red-400' : 'text-[#A8E8F9]'}`}>
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base items-center gap-2">
                <FiTag />
                <span>Category *</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input ${errors.category ? 'border-red-400' : ''}`}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base items-center gap-2">
                <FiFileText />
                <span>Project Description *</span>
              </label>
              <div className="relative">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project in detail. Include requirements, timeline, and any specific skills needed..."
                  className={`form-input min-h-37.5 resize-none ${errors.description ? 'border-red-400' : ''}`}
                  maxLength={2000}
                  disabled={loading}
                />
                {errors.description && (
                  <div className="absolute right-3 top-3">
                    <FiAlertCircle className="text-red-400" />
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                {errors.description ? (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-sm text-[#A8E8F9]">
                    Detailed descriptions attract better bids
                  </p>
                )}
                <span className={`text-sm ${formData.description.length > 1900 ? 'text-red-400' : 'text-[#A8E8F9]'}`}>
                  {formData.description.length}/2000
                </span>
              </div>
            </div>

            {/* Budget and Location Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Budget Field */}
              <div>
                <label className=" text-white mb-2 font-medium text-sm sm:text-base flex items-center gap-2">
                  <FiDollarSign />
                  <span>Budget (USD) *</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="500"
                    className={`form-input pl-10 ${errors.budget ? 'border-red-400' : ''}`}
                    min="1"
                    step="1"
                    disabled={loading}
                  />
                  {errors.budget && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <FiAlertCircle className="text-red-400" />
                    </div>
                  )}
                </div>
                {errors.budget && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <FiAlertCircle size={12} />
                    {errors.budget}
                  </p>
                )}
              </div>

              {/* Location Field */}
              <div>
                <label className="text-white mb-2 font-medium text-sm sm:text-base flex items-center gap-2">
                  <FiGlobe />
                  <span>Location (Optional)</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Remote, New York, Worldwide"
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Deadline Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base items-center gap-2">
                <FiCalendar />
                <span>Deadline (Optional)</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={getMinDate()}
                className={`form-input ${errors.deadline ? 'border-red-400' : ''}`}
                disabled={loading}
              />
              {errors.deadline && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <FiAlertCircle size={12} />
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Tips Section */}
            <div className="glass-light rounded-2xl p-4 sm:p-6">
              <h3 className="font-semibold text-[#F5A201] mb-3 text-sm sm:text-base flex items-center gap-2">
                <FiAlertCircle />
                Tips for a great gig post:
              </h3>
              <ul className="text-sm text-[#A8E8F9] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#F5A201] mt-0.5">•</span>
                  <span>Be clear and specific about your requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5A201] mt-0.5">•</span>
                  <span>Include your expected timeline and deliverables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5A201] mt-0.5">•</span>
                  <span>Set a realistic budget for the scope of work</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F5A201] mt-0.5">•</span>
                  <span>Mention any specific technologies or skills needed</span>
                </li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#00537A]">
              <button
                type="button"
                onClick={() => navigate('/gigs')}
                className="btn-secondary px-6 py-3 text-sm sm:text-base"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 text-sm sm:text-base flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#013C58] border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting Gig...</span>
                  </>
                ) : (
                  <>
                    <FiUpload />
                    <span>Post Gig</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}