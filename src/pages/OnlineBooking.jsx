import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaPhone, FaVenusMars, FaStethoscope, FaCheckCircle, FaHourglassHalf, FaSun, FaMoon, FaArrowLeft, FaTimes } from 'react-icons/fa'

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const OnlineBooking = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [liveStatus, setLiveStatus] = useState({
    availableSeats: 100,
    sessionStatus: 'CLOSED',
    currentSession: 'morning'
  })
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    complaint: '',
    preferredSession: 'morning'
  })
  const [bookingStatus, setBookingStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)

  // Create axios instance with base URL
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  useEffect(() => {
    fetchLiveStatus()
    
    // If there's a phone number in localStorage, auto-check status
    const savedPhone = localStorage.getItem('lastBookingPhone')
    if (savedPhone && step === 2) {
      setFormData(prev => ({ ...prev, phone: savedPhone }))
      checkStatusByPhone(savedPhone)
    }
  }, [step])

  const fetchLiveStatus = async () => {
    try {
      const response = await api.get('/public/live-status')
      setLiveStatus(response.data)
    } catch (error) {
      console.error('Failed to fetch live status:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/public/booking/request', formData)
      
      if (response.data.success) {
        // Save phone number for later status checking
        localStorage.setItem('lastBookingPhone', formData.phone)
        setBookingStatus('pending')
        setStep(2)
        toast.success('Booking request submitted successfully!')
        
        // Auto-check status after 2 seconds
        setTimeout(() => {
          checkStatusByPhone(formData.phone)
        }, 2000)
      } else {
        if (response.data.message === 'Slots full') {
          setBookingStatus('full')
          toast.error('Sorry, today\'s slots are full!')
        } else {
          toast.error('Something went wrong. Please try again.')
        }
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error(error.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  const checkStatusByPhone = async (phone) => {
    if (!phone) return
    
    setChecking(true)
    
    try {
      const response = await api.get(`/public/check-seat/${phone}`)
      
      if (response.data) {
        if (response.data.seatNumber) {
          setBookingStatus('approved')
          toast.success(`Your seat is confirmed! Seat No: ${response.data.seatNumber}`)
        } else if (response.data.status === 'cancelled') {
          setBookingStatus('cancelled')
          toast.error('Your booking request was cancelled')
        } else {
          setBookingStatus('pending')
        }
      }
    } catch (error) {
      console.error('Failed to check status:', error)
      setBookingStatus('pending')
    } finally {
      setChecking(false)
    }
  }

  const checkStatus = () => {
    checkStatusByPhone(formData.phone)
  }

  const goToLiveStatus = () => {
    navigate('/live-status')
  }

  const goBack = () => {
    setStep(1)
    setBookingStatus(null)
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto">
        {/* Live Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
          onClick={goToLiveStatus}
        >
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Available Seats:</span>
              <span className="text-2xl font-bold text-primary-600">{liveStatus.availableSeats}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Current Session:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                liveStatus.sessionStatus === 'MORNING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : liveStatus.sessionStatus === 'EVENING'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
              }`}>
                {liveStatus.sessionStatus === 'MORNING' ? 'Morning Session' : 
                 liveStatus.sessionStatus === 'EVENING' ? 'Evening Session' : 'Closed'}
              </span>
            </div>
            <div className="text-primary-600 text-sm font-medium">
              Click to view Live Status →
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-ayurvedic text-gray-800 mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">
            Fill the form below to request an appointment
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="flex-1 text-center">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold mb-2 ${
                  step >= i 
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {i}
                </div>
                <p className={`text-sm ${step >= i ? 'text-primary-600' : 'text-gray-500'}`}>
                  {i === 1 ? 'Request Booking' : 'Check Status'}
                </p>
              </div>
            ))}
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: step === 1 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step === 1 ? 50 : -50 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                      placeholder="Your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaVenusMars className="inline mr-2" />
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Session
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="preferredSession"
                        value="morning"
                        checked={formData.preferredSession === 'morning'}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <div className="flex items-center justify-center space-x-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-yellow-500 peer-checked:bg-yellow-50">
                        <FaSun className="text-yellow-500" />
                        <span>Morning (9:30 AM - 1:00 PM)</span>
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="preferredSession"
                        value="evening"
                        checked={formData.preferredSession === 'evening'}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <div className="flex items-center justify-center space-x-2 p-3 border-2 border-gray-200 rounded-xl cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50">
                        <FaMoon className="text-indigo-500" />
                        <span>Evening (5:00 PM - 9:00 PM)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaStethoscope className="inline mr-2" />
                    Main Complaint / Reason for Visit
                  </label>
                  <textarea
                    name="complaint"
                    value={formData.complaint}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500"
                    placeholder="Please describe your health concern..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading || liveStatus.availableSeats === 0}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                    liveStatus.availableSeats === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : liveStatus.availableSeats === 0 ? (
                    'No Seats Available'
                  ) : (
                    'Submit Booking Request'
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  Your request will be reviewed by our receptionist. You'll be notified once confirmed.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                {bookingStatus === 'pending' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="inline-block p-6 bg-yellow-100 rounded-full mb-4">
                      <FaHourglassHalf className="text-6xl text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Request Pending</h2>
                    <p className="text-gray-600 mb-6">
                      Your booking request is being reviewed. You'll be notified once confirmed.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={checkStatus}
                        disabled={checking}
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {checking ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Checking...</span>
                          </>
                        ) : (
                          'Check Status'
                        )}
                      </button>
                      
                      <button
                        onClick={goToLiveStatus}
                        className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                      >
                        <span>View Live Status</span>
                      </button>
                    </div>

                    <button
                      onClick={goBack}
                      className="mt-4 text-primary-600 hover:text-primary-800 flex items-center justify-center gap-2 mx-auto"
                    >
                      <FaArrowLeft size={14} />
                      <span>Book another appointment</span>
                    </button>
                  </motion.div>
                )}

                {bookingStatus === 'approved' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="inline-block p-6 bg-green-100 rounded-full mb-4">
                      <FaCheckCircle className="text-6xl text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                    <p className="text-2xl text-primary-600 mb-4">
                      Your Seat is Confirmed
                    </p>
                    <p className="text-gray-600 mb-6">
                      Please arrive 15 minutes before your scheduled time.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={goToLiveStatus}
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all"
                      >
                        View Live Queue
                      </button>
                      
                      <button
                        onClick={() => {
                          setStep(1)
                          setBookingStatus(null)
                          setFormData({
                            name: '',
                            phone: '',
                            age: '',
                            gender: '',
                            complaint: '',
                            preferredSession: 'morning'
                          })
                        }}
                        className="bg-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all"
                      >
                        Book Another
                      </button>
                    </div>
                  </motion.div>
                )}

                {bookingStatus === 'full' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="inline-block p-6 bg-red-100 rounded-full mb-4">
                      <FaHourglassHalf className="text-6xl text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Today's Slots Full</h2>
                    <p className="text-gray-600 mb-6">
                      All seats for today are booked. Please try again tomorrow.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700"
                    >
                      Book for Another Day
                    </button>
                  </motion.div>
                )}

                {bookingStatus === 'cancelled' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="inline-block p-6 bg-red-100 rounded-full mb-4">
                      <FaTimes className="text-6xl text-red-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Cancelled</h2>
                    <p className="text-gray-600 mb-6">
                      Your booking request was cancelled. Please book again.
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700"
                    >
                      Book Again
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OnlineBooking