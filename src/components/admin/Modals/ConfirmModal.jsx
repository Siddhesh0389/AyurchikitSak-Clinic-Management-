import React from 'react'
import { motion } from 'framer-motion'
import { FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'info' 
}) => {
  if (!isOpen) return null

  const colors = {
    info: {
      icon: <FaInfoCircle className="text-4xl text-blue-500" />,
      confirm: 'bg-blue-600 hover:bg-blue-700',
      bg: 'bg-blue-50'
    },
    danger: {
      icon: <FaExclamationTriangle className="text-4xl text-red-500" />,
      confirm: 'bg-red-600 hover:bg-red-700',
      bg: 'bg-red-50'
    },
    warning: {
      icon: <FaExclamationTriangle className="text-4xl text-yellow-500" />,
      confirm: 'bg-yellow-600 hover:bg-yellow-700',
      bg: 'bg-yellow-50'
    }
  }

  const colorSet = colors[type] || colors.info

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
        className="bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${colorSet.bg} p-4 rounded-xl mb-4 flex items-center space-x-4`}>
          {colorSet.icon}
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onConfirm}
            className={`flex-1 ${colorSet.confirm} text-white px-4 py-2 rounded-lg font-semibold transition-colors`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ConfirmModal