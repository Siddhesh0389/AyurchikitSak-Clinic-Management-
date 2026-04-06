import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner