import { useState, useCallback, useRef, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const useAdminData = (token, connected) => {
  const [patients, setPatients] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [seats, setSeats] = useState([])
  const [stats, setStats] = useState({
    totalPatients: 0,
    morningPatients: 0,
    eveningPatients: 0,
    waitingPatients: 0,
    completedPatients: 0,
    currentNumber: 1,
    sessionStatus: 'CLOSED',
    currentSession: 'morning',
    clinicOpen: false,
    announcement: ''
  })
  const [clinicTimings, setClinicTimings] = useState({
    morningStart: '09:30',
    morningEnd: '13:00',
    eveningStart: '17:00', // Updated to 5:00 PM
    eveningEnd: '21:00',
    sundayHoliday: true,
    currentSession: 'morning'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  
  const isFetching = useRef(false)
  const lastFetchTime = useRef(0)
  const pollingInterval = useRef(null)

  // Log the API URL being used (for debugging)
  console.log('API URL:', API_URL)

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Set axios default authorization header
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])

  const fetchData = useCallback(async (force = false) => {
    if (isFetching.current) return
    
    const now = Date.now()
    if (!force && now - lastFetchTime.current < 10000) return
    
    isFetching.current = true
    setLoading(true)
    setError(null)
    
    try {
      lastFetchTime.current = now
      console.log('Fetching dashboard data from:', API_URL)
      
      const [statsRes, seatsRes, patientsRes, requestsRes, timingsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/seats'),
        api.get('/admin/patients/today'),
        api.get('/admin/requests/pending'),
        api.get('/admin/timings')
      ])
      
      setStats(statsRes.data || {})
      setSeats(seatsRes.data || [])
      setPatients(patientsRes.data || [])
      setPendingRequests(requestsRes.data || [])
      setClinicTimings(timingsRes.data || clinicTimings)
      
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setError('Failed to load dashboard data. Please check your connection.')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
      setRefreshing(false)
      isFetching.current = false
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData(true)
  }, [fetchData])

  // Polling setup
  useEffect(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
    }
    
    if (!connected) {
      pollingInterval.current = setInterval(() => {
        if (!document.hidden) {
          fetchData()
        }
      }, 30000)
    }
    
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [connected, fetchData])

  const updateRunningNumber = async (number) => {
    try {
      setStats(prev => ({ ...prev, currentNumber: number }))
      await api.post('/admin/running-number', { number })
      toast.success(`Now serving: ${number}`)
      fetchData(true)
    } catch (error) {
      console.error('Failed to update running number:', error)
      toast.error('Failed to update running number')
    }
  }

  const assignSeat = async (patientId, seatNumber, session) => {
    try {
      console.log('Assigning seat:', { patientId, seatNumber, session })
      
      const response = await api.post('/admin/assign-seat', {
        patientId,
        seatNumber,
        session: session
      })
      
      console.log('Assignment response:', response.data)
      toast.success(`Seat ${seatNumber} assigned successfully`)
      fetchData(true)
      return true
    } catch (error) {
      console.error('Failed to assign seat:', error)
      toast.error(error.response?.data?.message || 'Failed to assign seat')
      return false
    }
  }

  const rejectRequest = async (requestId) => {
    try {
      await api.post(`/admin/reject-request/${requestId}`)
      toast.success('Request rejected')
      fetchData(true)
    } catch (error) {
      console.error('Failed to reject request:', error)
      toast.error('Failed to reject request')
    }
  }

  const clearSeat = async (seatNumber) => {
    try {
      await api.post(`/admin/clear-seat/${seatNumber}`)
      toast.success(`Seat ${seatNumber} cleared`)
      fetchData(true)
    } catch (error) {
      console.error('Failed to clear seat:', error)
      toast.error('Failed to clear seat')
    }
  }

  const clearAllSeats = async () => {
    try {
      await api.post('/admin/clear-all-seats')
      toast.success('All seats cleared for new batch')
      fetchData(true)
    } catch (error) {
      console.error('Failed to clear seats:', error)
      toast.error('Failed to clear seats')
    }
  }

  const deletePatient = async (patientId) => {
    try {
      await api.delete(`/admin/patients/${patientId}`)
      toast.success('Patient deleted successfully')
      fetchData(true)
    } catch (error) {
      console.error('Failed to delete patient:', error)
      toast.error('Failed to delete patient')
    }
  }

  const addOfflinePatient = async (patientData) => {
    try {
      const response = await api.post('/admin/patients/offline', patientData)
      toast.success('Patient added successfully')
      fetchData(true)
      return true
    } catch (error) {
      console.error('Failed to add patient:', error)
      toast.error(error.response?.data?.message || 'Failed to add patient')
      return false
    }
  }

  const updateSession = async (session) => {
    try {
      await api.post('/admin/session/update', {
        session,
        active: true
      })
      toast.success(`Switched to ${session} session`)
      setClinicTimings(prev => ({ ...prev, currentSession: session }))
      fetchData(true)
    } catch (error) {
      console.error('Failed to update session:', error)
      toast.error('Failed to update session')
    }
  }

  const updateTimings = async (timings) => {
    try {
      await api.post('/admin/timings', timings)
      toast.success('Timings updated successfully')
      fetchData(true)
    } catch (error) {
      console.error('Failed to update timings:', error)
      toast.error('Failed to update timings')
    }
  }

  const updateAnnouncement = async (message) => {
    try {
      await api.post('/admin/announcement', { message })
      toast.success('Announcement updated')
      setStats(prev => ({ ...prev, announcement: message }))
    } catch (error) {
      console.error('Failed to update announcement:', error)
      toast.error('Failed to update announcement')
    }
  }

  const refreshData = () => {
    setRefreshing(true)
    fetchData(true)
  }

  return {
    patients,
    pendingRequests,
    seats,
    stats,
    clinicTimings,
    loading,
    error,
    refreshing,
    fetchData,
    refreshData,
    updateRunningNumber,
    assignSeat,
    rejectRequest,
    clearSeat,
    clearAllSeats,
    deletePatient,
    addOfflinePatient,
    updateSession,
    updateTimings,
    updateAnnouncement
  }
}