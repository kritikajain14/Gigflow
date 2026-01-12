import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="glass-dark mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 gradient-bg rounded-2xl flex items-center justify-center">
                <span className="text-[#013C58] font-bold text-lg sm:text-xl">GF</span>
              </div>
              <span className="text-2xl sm:text-3xl font-bold gradient-text">GigFlow</span>
            </div>
            <p className="text-[#A8E8F9] text-sm sm:text-base mb-6 max-w-xl">
              Connecting talented freelancers with exciting opportunities. 
              Post gigs, submit bids, and build your career with GigFlow.
            </p>
            <div className="flex gap-4 sm:gap-6">
              <a 
                href="#" 
                className="text-[#A8E8F9] hover:text-[#F5A201] transition-colors p-2 touch-target"
                aria-label="GitHub"
              >
                <FiGithub size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a 
                href="#" 
                className="text-[#A8E8F9] hover:text-[#F5A201] transition-colors p-2 touch-target"
                aria-label="Twitter"
              >
                <FiTwitter size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a 
                href="#" 
                className="text-[#A8E8F9] hover:text-[#F5A201] transition-colors p-2 touch-target"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} className="sm:w-6 sm:h-6" />
              </a>
              <a 
                href="#" 
                className="text-[#A8E8F9] hover:text-[#F5A201] transition-colors p-2 touch-target"
                aria-label="Email"
              >
                <FiMail size={20} className="sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#F5A201]">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { path: '/gigs', label: 'Browse Gigs' },
                { path: '/post-gig', label: 'Post a Gig' },
                { path: '/login', label: 'Login' },
                { path: '/register', label: 'Sign Up' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-[#A8E8F9] hover:text-[#F5A201] transition-colors text-sm sm:text-base inline-block py-1 touch-target"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-[#F5A201]">
              Legal
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { path: '#', label: 'Privacy Policy' },
                { path: '#', label: 'Terms of Service' },
                { path: '#', label: 'Cookie Policy' },
                { path: '#', label: 'FAQ' }
              ].map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.path} 
                    className="text-[#A8E8F9] hover:text-[#F5A201] transition-colors text-sm sm:text-base inline-block py-1 touch-target"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#00537A] mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
          <p className="text-[#A8E8F9] text-sm sm:text-base">
            &copy; {currentYear} GigFlow. All rights reserved.
          </p>
          <p className="text-[#A8E8F9] text-xs sm:text-sm mt-2 flex items-center justify-center gap-1">
            Made with <FiHeart className="text-[#F5A201]" /> for the freelancing community
          </p>
        </div>
      </div>
    </footer>
  )
}