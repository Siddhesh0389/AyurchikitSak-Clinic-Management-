import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import jwt_decode from 'jwt-decode'

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  // Log the API URL being used (for debugging)
  console.log('Auth API URL:', API_URL)

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwt_decode(token)
        const currentTime = Date.now() / 1000
        
        if (decoded.exp < currentTime) {
          // Token expired
          logout()
        } else {
          setUser(decoded)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          // Also set for default axios instance (for backward compatibility)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch (error) {
        console.error('Token decode error:', error)
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { token, id, name, email, phone } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser({ id, name, email, phone })
      
      // Set authorization header for both api instance and default axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      toast.success('Login successful!')
      navigate('/admin')
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
      return { success: false, error: error.response?.data }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    
    // Remove authorization headers
    delete api.defaults.headers.common['Authorization']
    delete axios.defaults.headers.common['Authorization']
    
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    api // Expose the api instance for use in components
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}