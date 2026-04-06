import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LiveStatus from './pages/LiveStatus'
import OnlineBooking from './pages/OnlineBooking'
import Contact from './pages/Contact' // Import Contact page
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { WebSocketProvider } from './contexts/WebSocketContext'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live-status" element={<LiveStatus />} />
              <Route path="/booking" element={<OnlineBooking />} />
              <Route path="/contact" element={<Contact />} /> {/* New Contact route */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WebSocketProvider>
    </AuthProvider>
  )
}

export default App