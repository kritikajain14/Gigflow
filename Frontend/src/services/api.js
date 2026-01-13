import axios from 'axios'

const API = import.meta.env.VITE_API_URL // Render backend URL

const api = axios.create({
  baseURL: API + '/api', // Append /api because backend routes are /api/auth, /api/gigs...
  // withCredentials: true, // Needed for cookies
})


// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    localStorage.removeItem('token');
      window.location.href = '/login';
    //   window.location.href = '/login'
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