import React from 'react'
import { motion } from 'framer-motion'
import { FaSun, FaMoon, FaUserPlus, FaTrashAlt } from 'react-icons/fa'

const SessionControls = ({ currentSession, onUpdate, onAddPatient, onClearAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-gray-700">Session Control:</h3>
          <button
            onClick={() => onUpdate('morning')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              currentSession === 'morning'
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaSun />
            <span>Morning</span>
          </button>
          <button
            onClick={() => onUpdate('evening')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              currentSession === 'evening'
                ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FaMoon />
            <span>Evening</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onAddPatient}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <FaUserPlus />
            <span>Add Patient</span>
          </button>
          <button
            onClick={onClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <FaTrashAlt />
            <span>Clear All Seats</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SessionControls