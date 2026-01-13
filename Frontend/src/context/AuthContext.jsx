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
    const res = await authService.getMe();
    setUser(res.data.user);
  } catch (error) {
    console.error('Auth check failed');
    setUser(null);
  } finally {
    setLoading(false); // ✅ THIS FIXES INFINITE LOADING
  }
}, []);

useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const register = async (userData) => {
  const response = await authService.register(userData);

  localStorage.setItem('token', response.data.token);
  setUser(response.data.user);

  return {
    success: true,
    user: response.data.user
  };

  navigate('/');
};


const login = async (credentials) => {
  const response = await authService.login(credentials);

  localStorage.setItem('token', response.data.token);
  setUser(response.data.user);

  return {
    success: true,
    user: response.data.user
  };

  navigate('/');
};


  const logout = async () => {
  localStorage.removeItem('token');
  setUser(null);
  navigate('/login');
};

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
