import React, { useState, useEffect } from 'react'
import { FaBullhorn, FaEdit, FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const AnnouncementBar = ({ onUpdate, initialMessage = '' }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState(initialMessage)
  const [tempMessage, setTempMessage] = useState(initialMessage)
  const [announcementId, setAnnouncementId] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Add token interceptor
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  useEffect(() => {
    fetchCurrentAnnouncement()
  }, [])

  const fetchCurrentAnnouncement = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/current-announcement')
      if (response.data) {
        setMessage(response.data.message || '')
        setAnnouncementId(response.data.id || null)
      }
    } catch (error) {
      console.error('Failed to fetch announcement:', error)
      // Don't show toast for initial fetch error
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!tempMessage.trim()) {
      toast.error('Please enter a message')
      return
    }
    
    setLoading(true)
    try {
      await onUpdate(tempMessage)
      setMessage(tempMessage)
      setIsEditing(false)
      await fetchCurrentAnnouncement()
      toast.success('Announcement updated successfully')
    } catch (error) {
      toast.error('Failed to update announcement')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setTempMessage(message)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!announcementId) return
    
    setLoading(true)
    try {
      await api.delete(`/admin/announcement/${announcementId}`)
      setMessage('')
      setAnnouncementId(null)
      toast.success('Announcement deleted')
      setShowDeleteConfirm(false)
      await fetchCurrentAnnouncement()
    } catch (error) {
      toast.error('Failed to delete announcement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-4 mb-6 relative"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <FaBullhorn className={`text-xl ${message ? 'text-primary-600' : 'text-gray-400'}`} />
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={tempMessage}
                onChange={(e) => setTempMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter announcement message..."
                autoFocus
                disabled={loading}
              />
            ) : (
              <p className={`${message ? 'text-gray-700 font-medium' : 'text-gray-400 italic'}`}>
                {loading ? 'Loading...' : (message || 'No active announcement. Click edit to add one.')}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={loading}
                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save"
              >
                <FaCheck />
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel"
              >
                <FaTimes />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Edit announcement"
              >
                <FaEdit />
              </button>
              {message && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete announcement"
                >
                  <FaTrash />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/90 rounded-xl flex items-center justify-center z-10"
          >
            <div className="text-center p-4">
              <p className="text-gray-700 mb-3">Delete this announcement?</p>
              <div className="flex space-x-2 justify-center">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AnnouncementBar