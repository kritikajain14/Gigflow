import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { NotificationProvider } from './context/NotificationContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BrowseGigs from './pages/BrowseGigs'
import PostGig from './pages/PostGig'
import PostBid from './pages/PostBid'
import MyGigs from './pages/MyGigs'
import MyBids from './pages/MyBids'
import GigBids from './pages/GigBids'
import PrivateRoute from './components/PrivateRoute'
import Notification from './components/Notification'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <SocketProvider>
            <div className="min-h-screen flex flex-col bg-[#013C58] text-white">
              <Navbar />
              <main className="grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/gigs" element={<BrowseGigs />} />
                  
                  <Route element={<PrivateRoute />}>
                    <Route path="/post-gig" element={<PostGig />} />
                    <Route path="/my-gigs" element={<MyGigs />} />
                    <Route path="/my-bids" element={<MyBids />} />
                    <Route path="/gigs/:gigId/bids" element={<GigBids />} />
                    // In App.jsx, add this route within the PrivateRoute
                    <Route path="/post-bid/:id" element={<PostBid />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
              <Notification />
            </div>
          </SocketProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  )
}