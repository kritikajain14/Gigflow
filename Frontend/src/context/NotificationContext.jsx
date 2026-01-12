import { createContext, useState, useContext, useCallback } from 'react'

const NotificationContext = createContext(null)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    // Clear any existing notification
    setNotification(null)
    
    // Set new notification after a small delay
    setTimeout(() => {
      setNotification({ message, type, id: Date.now() })
    }, 100)

    // Auto-hide notification
    const timer = setTimeout(() => {
      setNotification(null)
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(null)
  }, [])

  const value = {
    notification,
    showNotification,
    hideNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}