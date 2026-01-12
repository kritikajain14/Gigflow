import { useNotification } from '../context/NotificationContext'
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

export default function Notification() {
  const { notification, hideNotification } = useNotification()

  const getIcon = () => {
    switch (notification?.type) {
      case 'success':
        return <FiCheckCircle className="text-green-400" />
      case 'error':
        return <FiXCircle className="text-red-400" />
      default:
        return <FiInfo className="text-blue-400" />
    }
  }

  const getBgColor = () => {
    switch (notification?.type) {
      case 'success':
        return 'bg-green-400/10 border-green-400/30'
      case 'error':
        return 'bg-red-400/10 border-red-400/30'
      default:
        return 'bg-blue-400/10 border-blue-400/30'
    }
  }

  const notificationVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          variants={notificationVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 ${getBgColor()} border rounded-2xl p-4 backdrop-blur-md shadow-xl`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{getIcon()}</div>
            <div className="grow min-w-0">
              <p className="text-white text-sm sm:text-base wrap-break-word">
                {notification.message}
              </p>
            </div>
            <button
              onClick={hideNotification}
              className="text-[#A8E8F9] hover:text-white transition-colors shrink-0 p-1 touch-target"
              aria-label="Close notification"
            >
              <FiX />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}