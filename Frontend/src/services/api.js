import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Gig services
export const gigService = {
  getGigs: (params) => api.get('/gigs', { params }),
  createGig: (gigData) => api.post('/gigs', gigData),
  getMyGigs: () => api.get('/gigs/my-gigs'),
}

// Bid services
export const bidService = {
  createBid: (bidData) => api.post('/bids', bidData),
  getMyBids: () => api.get('/bids/my-bids'),
  getGigBids: (gigId) => api.get(`/bids/${gigId}`),
  hireFreelancer: (bidId) => api.patch(`/bids/${bidId}/hire`),
}