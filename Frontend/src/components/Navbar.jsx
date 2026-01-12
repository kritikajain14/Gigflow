import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiSearch, FiPlus, FiBriefcase, FiUser, FiLogOut, FiHome, FiMessageSquare } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  const menuItems = [
    { path: '/', label: 'Home', icon: <FiHome /> },
    { path: '/gigs', label: 'Browse Gigs', icon: <FiSearch /> },
    ...(user ? [
      { path: '/post-gig', label: 'Post Gig', icon: <FiPlus /> },
      { path: '/my-gigs', label: 'My Gigs', icon: <FiBriefcase /> },
      { path: '/my-bids', label: 'My Bids', icon: <FiMessageSquare /> },
    ] : [])
  ]

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.2
      }
    }
  }

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className={` z-50 transition-all duration-300 ${scrolled ? 'backdrop-blur-md bg-[#013C58]/90 shadow-md' : 'bg-transparent'} safe-top`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 gradient-bg rounded-2xl flex items-center justify-center">
                <FiBriefcase className="text-[#013C58] text-lg sm:text-xl" />
              </div>
              <span className="text-xl sm:text-2xl font-bold gradient-text">GigFlow</span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4 xl:gap-6">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm xl:text-base flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'text-[#F5A201] bg-[#F5A201]/10'
                      : 'text-white hover:text-[#F5A201] hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 sm:gap-3 text-white hover:text-[#F5A201] transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#00537A] rounded-full flex items-center justify-center">
                      <FiUser className="text-sm sm:text-base" />
                    </div>
                    <span className="hidden sm:inline text-sm xl:text-base">{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl">
                    <div className="px-4 py-2 border-b border-[#00537A]">
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-[#A8E8F9] truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-[#00537A]/50 rounded-xl transition-colors flex items-center gap-2 text-sm text-white"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link 
                    to="/login" 
                    className="text-sm xl:text-base text-white hover:text-[#F5A201] transition-colors px-4 py-2"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-sm xl:text-base"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white hover:text-[#F5A201] transition-colors p-2 touch-target"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#013C58] shadow-2xl z-50 lg:hidden overflow-y-auto safe-bottom"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#00537A]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 gradient-bg rounded-2xl flex items-center justify-center">
                      <FiBriefcase className="text-[#013C58] text-xl" />
                    </div>
                    <span className="text-2xl font-bold gradient-text">GigFlow</span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-[#F5A201] transition-colors p-2 touch-target"
                    aria-label="Close menu"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* User Info (if logged in) */}
                {user && (
                  <div className="p-6 border-b border-[#00537A]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-[#00537A] rounded-full flex items-center justify-center">
                        <FiUser size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-sm text-[#A8E8F9] truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <nav className="flex-1 p-6">
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-colors ${
                          location.pathname === item.path
                            ? 'text-[#F5A201] bg-[#F5A201]/10'
                            : 'text-white hover:text-[#F5A201] hover:bg-white/5'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="text-lg">{item.icon}</div>
                        <span className="text-lg font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Auth Buttons */}
                <div className="p-6 border-t border-[#00537A]">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-4 text-white hover:text-[#F5A201] transition-colors bg-[#00537A] rounded-xl touch-target"
                    >
                      <FiLogOut />
                      <span className="font-medium">Logout</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-4 text-white hover:text-[#F5A201] transition-colors bg-[#00537A] rounded-xl touch-target font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block w-full text-center btn-primary py-4 touch-target"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}