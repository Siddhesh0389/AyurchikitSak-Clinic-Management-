import React, { useState, useEffect, useCallback } from 'react'
import { useWebSocket } from '../contexts/WebSocketContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  FaUsers, FaChair, FaClock, FaSun, FaMoon, FaRegSun,
  FaPhone, FaSearch, FaSpinner, FaCheckCircle, FaTimesCircle,
  FaSync
} from 'react-icons/fa'

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
})

const LiveStatus = () => {
  const { liveData, connected } = useWebSocket()
  const [localData, setLocalData] = useState({
    currentNumber: 1,
    totalPatients: 0,
    availableSeats: 100,
    occupiedSeats: 0,
    sessionStatus: 'CLOSED',
    clinicOpen: false,
    morningCount: 0,
    eveningCount: 0
  })
  const [phoneNumber, setPhoneNumber] = useState('')
  const [checking, setChecking] = useState(false)
  const [seatInfo, setSeatInfo] = useState(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState(0)

  // Fetch live status from API
  const fetchLiveStatus = useCallback(async (force = false) => {
    // Don't fetch if we fetched in the last 5 seconds (unless forced)
    const now = Date.now()
    if (!force && now - lastFetchTime < 5000) {
      return
    }

    try {
      const response = await api.get('/public/live-status')
      if (response.data) {
        console.log('Live status fetched:', response.data)
        setLocalData(prev => ({
          ...prev,
          ...response.data
        }))
        setLastFetchTime(now)
      }
    } catch (error) {
      console.error('Failed to fetch live status:', error)
    }
  }, [lastFetchTime])

  // Initial fetch on mount
  useEffect(() => {
    fetchLiveStatus(true)
    
    // Also fetch when page becomes visible again
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLiveStatus(true)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchLiveStatus])

  // Update local data when WebSocket data changes
  useEffect(() => {
    if (liveData && Object.keys(liveData).length > 0) {
      console.log('WebSocket live data received:', liveData)
      setLocalData(prev => ({
        ...prev,
        ...liveData
      }))
    }
  }, [liveData])

  // Fallback polling if WebSocket is not connected
  useEffect(() => {
    let interval
    
    if (!connected) {
      console.log('WebSocket disconnected, starting polling')
      interval = setInterval(() => {
        fetchLiveStatus()
      }, 10000) // Poll every 10 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [connected, fetchLiveStatus])

  const getSessionIcon = () => {
    switch (localData.sessionStatus) {
      case 'MORNING':
        return <FaSun className="text-4xl text-yellow-500" />
      case 'EVENING':
        return <FaMoon className="text-4xl text-indigo-500" />
      default:
        return <FaRegSun className="text-4xl text-gray-500" />
    }
  }

  const getSessionColor = () => {
    switch (localData.sessionStatus) {
      case 'MORNING':
        return 'from-yellow-400 to-orange-500'
      case 'EVENING':
        return 'from-indigo-400 to-purple-500'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getSessionText = () => {
    if (!localData.clinicOpen) return 'Clinic Closed'
    return localData.sessionStatus === 'MORNING' ? 'Morning Session Active' : 'Evening Session Active'
  }

  const checkSeatByPhone = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setChecking(true)
    setError('')
    setSeatInfo(null)

    try {
      const response = await api.get(`/public/check-seat/${phoneNumber}`)
      
      if (response.data) {
        setSeatInfo(response.data)
        if (response.data.seatNumber) {
          toast.success(`Seat found! Your seat number is ${response.data.seatNumber}`)
        } else {
          toast.info('No seat assigned yet. Please wait for admin confirmation.')
        }
      }
    } catch (error) {
      console.error('Failed to check seat:', error)
      setError('No patient found with this phone number')
      toast.error('No patient found with this phone number')
    } finally {
      setChecking(false)
    }
  }

  const manualRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchLiveStatus(true)
      toast.success('Status updated!')
    } catch (error) {
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto">
        {/* Header with Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold font-ayurvedic text-gray-800 mb-4">
              Live Clinic Status
            </h1>
            <p className="text-lg text-gray-600">
              Real-time updates of clinic queue and availability
            </p>
          </div>
          <button
            onClick={manualRefresh}
            disabled={refreshing}
            className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            title="Refresh status"
          >
            <FaSync className={`text-primary-600 text-xl ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>

        {/* Connection Status */}
        {!connected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-center"
          >
            <div className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
              Using polling updates (WebSocket disconnected)
            </div>
          </motion.div>
        )}

        {/* Debug Info - Remove in production */}
        <div className="mb-4 text-xs text-gray-400 text-center">
          Server Time: {localData.sessionStatus} | Open: {localData.clinicOpen ? 'Yes' : 'No'}
        </div>

        {/* Main Status Card with Phone Check */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Now Serving Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className={`inline-block p-4 rounded-full bg-gradient-to-r ${getSessionColor()} bg-opacity-10 mb-4`}>
              {getSessionIcon()}
            </div>
            
            <div className="text-7xl md:text-8xl font-bold text-primary-600 mb-4">
              {localData.currentNumber}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">
              Now Serving
            </h2>
            
            <div className={`text-xl font-medium px-6 py-3 rounded-full inline-block ${
              localData.clinicOpen
                ? localData.sessionStatus === 'MORNING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-indigo-100 text-indigo-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {getSessionText()}
            </div>
          </motion.div>

          {/* Check Your Seat Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaPhone className="mr-2 text-primary-600" />
              Check Your Seat
            </h2>
            
            <p className="text-gray-600 mb-6">
              Enter your phone number to check your allocated seat
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value)
                    setSeatInfo(null)
                    setError('')
                  }}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength="10"
                />
              </div>
              <button
                onClick={checkSeatByPhone}
                disabled={checking || !phoneNumber}
                className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
              >
                {checking ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <FaSearch />
                    <span>Check</span>
                  </>
                )}
              </button>
            </div>

            {/* Result Display */}
            {seatInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
              >
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-800 mb-2">Patient Information</h3>
                    <p className="text-gray-700"><span className="font-medium">Name:</span> {seatInfo.name}</p>
                    {seatInfo.seatNumber ? (
                      <>
                        <p className="text-gray-700"><span className="font-medium">Seat Number:</span> <span className="text-2xl font-bold text-primary-600 ml-2">{seatInfo.seatNumber}</span></p>
                        <p className="text-gray-700"><span className="font-medium">Session:</span> {seatInfo.preferredSession}</p>
                        <p className="text-gray-700"><span className="font-medium">Status:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            seatInfo.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {seatInfo.status}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className="text-yellow-600 mt-2">No seat assigned yet. Please wait for admin confirmation.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-red-50 rounded-xl border border-red-200"
              >
                <div className="flex items-start gap-3">
                  <FaTimesCircle className="text-red-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-red-700">{error}</p>
                    <p className="text-sm text-gray-500 mt-1">Please check the number or visit the reception.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl text-primary-600 mb-3">
              <FaUsers className="mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {localData.totalPatients}
            </div>
            <div className="text-gray-600">Total Patients Today</div>
            <div className="mt-2 flex justify-center text-sm">
              <span className="text-yellow-600 mr-3">M: {localData.morningCount}</span>
              <span className="text-indigo-600">E: {localData.eveningCount}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl text-secondary-600 mb-3">
              <FaChair className="mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {localData.availableSeats}
            </div>
            <div className="text-gray-600">Seats Available</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
          >
            <div className="text-4xl text-accent mb-3">
              <FaClock className="mx-auto" />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {localData.occupiedSeats}
            </div>
            <div className="text-gray-600">Seats Filled</div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">Today's Capacity</span>
            <span className="text-gray-900 font-bold">{localData.occupiedSeats}/100</span>
          </div>
          
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              key={localData.occupiedSeats}
              initial={{ width: 0 }}
              animate={{ width: `${((localData.occupiedSeats || 0) / 100) * 100}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full rounded-full ${
                localData.occupiedSeats >= 100
                  ? 'bg-red-500'
                  : localData.occupiedSeats >= 80
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            ></motion.div>
          </div>
          
          {localData.availableSeats === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg text-center font-medium"
            >
              🚫 Today's Slots are Full
            </motion.div>
          )}

          {/* Last Updated Info */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
            {connected && <span className="ml-2 text-green-500">● Live</span>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LiveStatus