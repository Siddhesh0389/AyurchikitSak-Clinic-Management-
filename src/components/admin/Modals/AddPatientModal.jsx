import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSun, FaMoon, FaUser, FaPhone, FaVenusMars, FaStethoscope } from 'react-icons/fa'
import toast from 'react-hot-toast'

const AddPatientModal = ({ isOpen, onClose, onAdd, seats, defaultSession }) => {
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'male',
    complaint: '',
    preferredSession: defaultSession || 'morning',
    seatNumber: ''
  })

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!newPatient.seatNumber) {
      toast.error('Please select a seat number')
      return
    }
    
    if (!newPatient.name) {
      toast.error('Please enter patient name')
      return
    }

    if (!newPatient.phone) {
      toast.error('Please enter phone number')
      return
    }

    if (!newPatient.age) {
      toast.error('Please enter age')
      return
    }
    
    const success = await onAdd({
      ...newPatient,
      age: parseInt(newPatient.age),
      seatNumber: parseInt(newPatient.seatNumber)
    })
    
    if (success) {
      setNewPatient({
        name: '',
        phone: '',
        age: '',
        gender: 'male',
        complaint: '',
        preferredSession: defaultSession,
        seatNumber: ''
      })
      onClose()
    }
  }

  const availableSeats = seats.filter(s => s.status === 'available')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Add Offline Patient
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaUser className="inline mr-2" />
              Patient Name
            </label>
            <input
              type="text"
              value={newPatient.name}
              onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter patient name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaPhone className="inline mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              value={newPatient.phone}
              onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={newPatient.age}
                onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Age"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FaVenusMars className="inline mr-2" />
                Gender
              </label>
              <select
                value={newPatient.gender}
                onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="session"
                  value="morning"
                  checked={newPatient.preferredSession === 'morning'}
                  onChange={(e) => setNewPatient({...newPatient, preferredSession: e.target.value})}
                  className="mr-2"
                />
                <FaSun className="text-yellow-500 mr-1" />
                Morning
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="session"
                  value="evening"
                  checked={newPatient.preferredSession === 'evening'}
                  onChange={(e) => setNewPatient({...newPatient, preferredSession: e.target.value})}
                  className="mr-2"
                />
                <FaMoon className="text-indigo-500 mr-1" />
                Evening
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seat Number
            </label>
            <select
              value={newPatient.seatNumber}
              onChange={(e) => setNewPatient({...newPatient, seatNumber: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select Seat Number</option>
              {availableSeats.map(seat => (
                <option key={seat.seatNumber} value={seat.seatNumber}>
                  Seat {seat.seatNumber}
                </option>
              ))}
            </select>
            {availableSeats.length === 0 && (
              <p className="text-sm text-red-500 mt-1">No seats available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <FaStethoscope className="inline mr-2" />
              Complaint
            </label>
            <textarea
              value={newPatient.complaint}
              onChange={(e) => setNewPatient({...newPatient, complaint: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows="3"
              placeholder="Enter patient complaint"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={availableSeats.length === 0}
              className={`flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg font-semibold 
                ${availableSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-primary-700 hover:to-secondary-700'}`}
            >
              Add Patient
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AddPatientModal