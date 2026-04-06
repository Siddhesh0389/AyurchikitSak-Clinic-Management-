import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { FaUserMd, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa'

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: ''
  })
  const [loginMethod, setLoginMethod] = useState('email')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const result = await login(credentials)
    if (result.success) {
      navigate('/admin')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url('/leaf-pattern.png')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px'
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-4">
            <FaUserMd className="text-4xl text-primary-600" />
          </div>
          <h2 className="text-3xl font-ayurvedic font-bold text-gray-800 mb-2">
            Admin Login
          </h2>
          <p className="text-gray-600">
            Welcome back! Please login to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginMethod === 'email'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              <FaEnvelope className="inline mr-2" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                loginMethod === 'phone'
                  ? 'bg-white shadow-md text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              <FaPhone className="inline mr-2" />
              Phone
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {loginMethod === 'email' ? (
                  <FaEnvelope className="text-gray-400" />
                ) : (
                  <FaPhone className="text-gray-400" />
                )}
              </div>
              <input
                type={loginMethod === 'email' ? 'email' : 'tel'}
                value={credentials.identifier}
                onChange={(e) => setCredentials({...credentials, identifier: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={loginMethod === 'email' ? 'admin@ayurchikitsak.com' : '9876543210'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full ayurvedic-button disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Only authorized receptionist can access this area
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin