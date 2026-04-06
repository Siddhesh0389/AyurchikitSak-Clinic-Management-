import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

export default ErrorDisplay