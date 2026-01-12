import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { socket } from '../socket/socket';


const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
  if (user?.id) {
    socket.connect(); // ✅ connect only after login
    socket.emit('join-user-room', user.id);
  }
}, [user]);


  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/auth/me', {
        withCredentials: true
      })
      
      if (response.data.success) {
        setUser(response.data.user)
        setError(null)
      }
    } catch (error) {
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
      const response = await axios.post('/api/auth/register', userData, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setUser(response.data.user)
        setError(null)
        navigate('/')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      setError(message)
      return {
        success: false,
        message
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await axios.post('/api/auth/login', credentials, {
        withCredentials: true
      })
      
      if (response.data.success) {
        setUser(response.data.user)
        setError(null)
        navigate('/')
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      return {
        success: false,
        message
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      })
      socket.disconnect();
      setUser(null)
      setError(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      setError('Logout failed')
    }
  }

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}