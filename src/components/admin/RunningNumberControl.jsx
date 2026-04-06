import React from 'react'
import { motion } from 'framer-motion'

const RunningNumberControl = ({ runningNumber, onUpdate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Live Running Number:</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onUpdate(Math.max(1, runningNumber - 1))}
            className="w-10 h-10 bg-gray-200 rounded-full text-xl hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="text-3xl font-bold text-primary-600 w-16 text-center">{runningNumber}</span>
          <button
            onClick={() => onUpdate(Math.min(100, runningNumber + 1))}
            className="w-10 h-10 bg-gray-200 rounded-full text-xl hover:bg-gray-300 transition-colors"
          >
            +
          </button>
          <input
            type="number"
            min="1"
            max="100"
            value={runningNumber}
            onChange={(e) => onUpdate(parseInt(e.target.value) || 1)}
            className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default RunningNumberControl