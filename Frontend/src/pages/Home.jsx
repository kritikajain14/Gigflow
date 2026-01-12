import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiSearch, 
  FiBriefcase, 
  FiDollarSign, 
  FiUsers,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiStar
} from 'react-icons/fi'

export default function Home() {
  const features = [
    {
      icon: <FiSearch />,
      title: 'Find Perfect Gigs',
      description: 'Browse through hundreds of opportunities that match your skills and interests.'
    },
    {
      icon: <FiBriefcase />,
      title: 'Post Projects',
      description: 'Need work done? Post your gig and get competitive bids from talented freelancers.'
    },
    {
      icon: <FiDollarSign />,
      title: 'Competitive Bidding',
      description: 'Submit your best bids and get hired based on your skills and value proposition.'
    },
    {
      icon: <FiUsers />,
      title: 'Build Reputation',
      description: 'Complete projects successfully to build your reputation and attract better opportunities.'
    }
  ]

  const stats = [
    { value: '500+', label: 'Active Gigs' },
    { value: '2,000+', label: 'Freelancers' },
    { value: '$150K+', label: 'Paid Out' },
    { value: '98%', label: 'Success Rate' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Web Developer',
      text: 'GigFlow helped me find consistent freelance work. The platform is intuitive and the clients are great!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Graphic Designer',
      text: 'Best freelancing platform I\'ve used. The bidding system is fair and transparent.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'Content Writer',
      text: 'As a client, I found amazing talent quickly. The quality of work exceeded my expectations.',
      rating: 4
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 sm:mb-16 lg:mb-20"
      >
        <h1 className="font-bold mb-4 sm:mb-6">
          <span className="gradient-text block mb-2">Freelance</span>
          <span className="text-white">Made Simple</span>
        </h1>
        <p className="text-lg sm:text-xl text-[#A8E8F9] mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
          Connect with top talent or find your next opportunity on GigFlow. 
          The modern platform for freelancers and clients to collaborate seamlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto px-4">
          <Link 
            to="/gigs" 
            className="btn-primary"
          >
            <span>Find Gigs</span>
            <FiArrowRight />
          </Link>
          <Link 
            to="/post-gig" 
            className="btn-secondary"
          >
            <span>Post a Gig</span>
            <FiArrowRight />
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-12 sm:mb-16 lg:mb-20"
      >
        <h2 className="text-center mb-8 sm:mb-12 text-white">
          Why Choose <span className="gradient-text">GigFlow</span>?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-glass p-5 sm:p-6 hover:shadow-[0_0_20px_rgba(245,162,1,0.1)]"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-bg rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                <div className="text-xl sm:text-2xl text-[#013C58]">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-white">
                {feature.title}
              </h3>
              <p className="text-[#A8E8F9] text-sm sm:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      

      {/* How It Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-12 sm:mb-16 lg:mb-20"
      >
        <h2 className="text-center mb-8 sm:mb-12 text-white">
          How It <span className="gradient-text">Works</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              step: '1',
              title: 'Post or Find',
              description: 'Clients post gigs with detailed requirements. Freelancers browse available opportunities.',
              icon: <FiBriefcase />
            },
            {
              step: '2',
              title: 'Bid & Review',
              description: 'Freelancers submit competitive bids. Clients review proposals and shortlist candidates.',
              icon: <FiDollarSign />
            },
            {
              step: '3',
              title: 'Hire & Deliver',
              description: 'Clients hire the best fit. Freelancers deliver quality work and get paid securely.',
              icon: <FiCheckCircle />
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="card-glass p-6 relative"
            >
              <div className="absolute -top-4 left-6 w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                <span className="text-[#013C58] font-bold">{item.step}</span>
              </div>
              <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center mb-4">
                <div className="text-xl text-[#013C58]">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {item.title}
              </h3>
              <p className="text-[#A8E8F9]">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="gradient-border p-6 sm:p-8 rounded-2xl text-center"
      >
        <h2 className="font-bold mb-3 sm:mb-4 text-white">
          Ready to Get Started?
        </h2>
        <p className="text-[#A8E8F9] mb-5 sm:mb-6 text-lg sm:text-xl">
          Join thousands of freelancers and clients building the future of work.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
          <Link 
            to="/register" 
            className="btn-primary"
          >
            <span>Create Free Account</span>
            <FiArrowRight />
          </Link>
          <Link 
            to="/gigs" 
            className="btn-secondary"
          >
            <span>Browse Gigs</span>
            <FiArrowRight />
          </Link>
        </div>
      </motion.section>
    </div>
  )
}