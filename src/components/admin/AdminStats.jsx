import React from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaClock, FaSun, FaMoon, FaRegSun, FaChair } from 'react-icons/fa'

const AdminStats = ({ stats, seats }) => {
  
  const getSessionIcon = (session) => {
    if (session === 'morning') return <FaSun className="text-yellow-500" />
    if (session === 'evening') return <FaMoon className="text-indigo-500" />
    return <FaRegSun className="text-gray-500" />
  }

  const getSessionColor = (session) => {
    if (session === 'morning') return 'from-yellow-400 to-orange-500'
    if (session === 'evening') return 'from-indigo-400 to-purple-500'
    return 'from-gray-400 to-gray-600'
  }

  const occupiedSeats = seats.filter(s => s.status === 'occupied').length

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {/* Total Patients */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Today's Patients</p>
            <p className="text-3xl font-bold text-gray-800">{stats.totalPatients || 0}</p>
          </div>
          <div className="p-3 bg-primary-100 rounded-lg">
            <FaUsers className="text-primary-600 text-xl" />
          </div>
        </div>
        <div className="mt-2 flex text-sm">
          <span className="text-yellow-600 mr-3">M: {stats.morningPatients || 0}</span>
          <span className="text-indigo-600">E: {stats.eveningPatients || 0}</span>
        </div>
      </motion.div>

      {/* Current Number */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Current Number</p>
            <p className="text-3xl font-bold text-primary-600">{stats.currentNumber}</p>
          </div>
          <div className="p-3 bg-secondary-100 rounded-lg">
            <FaClock className="text-secondary-600 text-xl" />
          </div>
        </div>
        <div className="mt-2">
          <span className={`text-sm ${stats.clinicOpen ? 'text-green-600' : 'text-red-600'}`}>
            {stats.clinicOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </motion.div>

      {/* Session */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Session</p>
            <p className="text-3xl font-bold text-gray-800 capitalize">{stats.currentSession || 'morning'}</p>
          </div>
          <div className={`p-3 bg-gradient-to-r ${getSessionColor(stats.currentSession)} rounded-lg`}>
            {getSessionIcon(stats.currentSession)}
          </div>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-600">{stats.sessionStatus}</span>
        </div>
      </motion.div>

      {/* Seats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Seats</p>
            <p className="text-3xl font-bold text-gray-800">{occupiedSeats}/100</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <FaChair className="text-green-600 text-xl" />
          </div>
        </div>
        <div className="mt-2 flex text-sm">
          <span className="text-yellow-600 mr-3">Waiting: {stats.waitingPatients || 0}</span>
          <span className="text-green-600">Completed: {stats.completedPatients || 0}</span>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminStats