import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()

  // Check for redirect query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const redirect = params.get('redirect')
    if (redirect) {
      showNotification('Please login to continue', 'info')
    }
  }, [location.search, showNotification])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      showNotification('Please fill in all fields', 'error')
      return
    }

    setLoading(true)

    try {
      const result = await login(formData)
      
      if (result.success) {
        showNotification('Login successful!', 'success')
        // Redirect to intended page or home
        const params = new URLSearchParams(location.search)
        const redirect = params.get('redirect')
        navigate(redirect || '/')
      } else {
        showNotification(result.message, 'error')
      }
    } catch (error) {
      showNotification('An error occurred during login', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: 'demo@example.com',
      password: 'demo123'
    })
    showNotification('Using demo credentials', 'info')
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
              Welcome Back
            </h1>
            <p className="text-[#A8E8F9] text-sm sm:text-base">
              Sign in to your GigFlow account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                  className="form-input pl-12"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
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
                  className="form-input pl-12 pr-12"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  minLength={6}
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
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs sm:text-sm text-[#A8E8F9]">
                  Must be at least 6 characters
                </p>
                <Link 
                  to="/forgot-password" 
                  className="text-xs sm:text-sm text-[#F5A201] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Demo Login Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full px-4 py-3 text-sm sm:text-base text-[#A8E8F9] hover:text-white transition-colors bg-[#00537A]/30 rounded-xl border border-[#00537A]"
              disabled={loading}
            >
              Try Demo Account
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#013C58] border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
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

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-[#A8E8F9] text-sm sm:text-base">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-[#F5A201] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Terms Notice */}
          <p className="text-xs text-[#A8E8F9]/70 text-center mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}