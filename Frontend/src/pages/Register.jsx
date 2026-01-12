import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      
      if (result.success) {
        showNotification('Registration successful! Welcome to GigFlow!', 'success')
        navigate('/')
      } else {
        showNotification(result.message, 'error')
      }
    } catch (error) {
      showNotification('An error occurred during registration', 'error')
    } finally {
      setLoading(false)
    }
  }

  const passwordStrength = () => {
    if (!formData.password) return 0
    let strength = 0
    if (formData.password.length >= 6) strength += 1
    if (/[A-Z]/.test(formData.password)) strength += 1
    if (/[0-9]/.test(formData.password)) strength += 1
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1
    return strength
  }

  const getStrengthColor = () => {
    const strength = passwordStrength()
    if (strength <= 1) return 'bg-red-400'
    if (strength <= 2) return 'bg-yellow-400'
    return 'bg-green-400'
  }

  const getStrengthText = () => {
    const strength = passwordStrength()
    if (strength <= 1) return 'Weak'
    if (strength <= 2) return 'Medium'
    return 'Strong'
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        <motion.div
          variants={formVariants}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              Create Account
            </h1>
            <p className="text-[#A8E8F9] text-sm sm:text-base">
              Join GigFlow and start your freelancing journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`form-input pl-16 ${errors.name ? 'border-red-400' : ''}`}
                  required
                  minLength={2}
                  maxLength={50}
                  disabled={loading}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <FiCheck size={12} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`form-input pl-16 ${errors.email ? 'border-red-400' : ''}`}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <FiCheck size={12} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`form-input pl-16 pr-16 ${errors.password ? 'border-red-400' : ''}`}
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8E8F9] hover:text-white transition-colors touch-target"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-[#A8E8F9]">Password strength:</span>
                    <span className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-1 bg-[#00537A] rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength() * 25}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <FiCheck size={12} />
                  {errors.password}
                </p>
              )}
              
              <p className="text-xs text-[#A8E8F9] mt-2">
                Must be at least 6 characters with uppercase, lowercase, and numbers
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-white mb-2 font-medium text-sm sm:text-base">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8E8F9]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`form-input pl-16 pr-16 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8E8F9] hover:text-white transition-colors touch-target"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={loading}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                  <FiCheck size={12} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-[#F5A201] bg-[#00537A] border-[#00537A] rounded focus:ring-[#F5A201] focus:ring-2"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-[#A8E8F9]">
                I agree to the{' '}
                <Link to="/terms" className="text-[#F5A201] hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-[#F5A201] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#013C58] border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiUserPlus />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="grow border-t border-[#00537A]"></div>
            <span className="px-4 text-[#A8E8F9] text-sm">or</span>
            <div className="grow border-t border-[#00537A]"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-[#A8E8F9] text-sm sm:text-base">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-[#F5A201] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-[#00537A]/20 rounded-xl">
            <p className="text-xs text-[#A8E8F9] text-center">
              🔒 Your data is securely encrypted and protected
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}