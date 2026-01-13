import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket/socket'
import api, { authService } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Connect socket after login
  useEffect(() => {
    if (user?.id) {
      socket.connect()
      socket.emit('join-user-room', user.id)
    }
  }, [user])

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authService.getMe()
      if (response.data.success) {
        setUser(response.data.user)
        setError(null)
      }
    } catch (err) {
      setUser(null)
      setError('Session expired. Please login again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      if (response.data.success) {
        setUser(response.data.user)
        setError(null)
        navigate('/')
        return { success: true }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)
      if (response.data.success) {
        setUser(response.data.user)
        setError(null)
        navigate('/')
        return { success: true }
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      socket.disconnect()
      setUser(null)
      setError(null)
      navigate('/login')
    } catch (err) {
      console.error('Logout error:', err)
      setError('Logout failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
