import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa'

const SeatLayout = ({ seats, onClearSeat }) => {
  const [selectedSeat, setSelectedSeat] = useState(null)

  const getSeatStatusColor = (seat) => {
    if (seat.status === 'available') {
      return 'bg-gradient-to-br from-green-400 to-green-600 text-white hover:shadow-lg'
    }
    
    // If occupied, check patient status
    if (seat.patientStatus === 'completed') {
      return 'bg-gradient-to-br from-gray-400 to-gray-600 text-white opacity-75 border-2 border-gray-300'
    }
    
    // Waiting patients - show session colors
    return seat.session === 'morning'
      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-2 border-yellow-300'
      : 'bg-gradient-to-br from-indigo-400 to-purple-600 text-white border-2 border-purple-300'
  }

  const getStatusIcon = (seat) => {
    if (seat.status === 'available') return null
    if (seat.patientStatus === 'completed') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <FaCheckCircle className="text-white text-opacity-50 text-lg" />
        </div>
      )
    }
    if (seat.patientStatus === 'waiting') {
      return (
        <div className="absolute top-1 right-1">
          <FaHourglassHalf className="text-white text-xs animate-pulse" />
        </div>
      )
    }
    return null
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
          Seat Layout - {seats.filter(s => s.status === 'occupied').length}/100 Occupied
        </h2>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span className="text-gray-600">Waiting</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-yellow-500 rounded"></div>
            <span className="text-gray-600">Morning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-purple-500 rounded"></div>
            <span className="text-gray-600">Evening</span>
          </div>
        </div>
      </div>

      {seats.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No seat data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {seats.map(seat => (
            <div key={seat.seatNumber} className="relative group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSeat(seat)}
                className={`w-full aspect-square rounded-xl font-bold text-sm transition-all relative overflow-hidden ${getSeatStatusColor(seat)}`}
                disabled={seat.patientStatus === 'completed'} // Optional: disable clicking on completed seats
              >
                <span className="absolute top-1 left-1 text-xs">{seat.seatNumber}</span>
                {getStatusIcon(seat)}
                {seat.status === 'occupied' && (
                  <div className="absolute bottom-1 left-1 right-1 text-[8px] truncate">
                    {seat.patientName?.split(' ')[0] || 'Patient'}
                  </div>
                )}
              </motion.button>
              
              {/* Only show clear button for waiting patients, not completed ones */}
              {seat.status === 'occupied' && seat.patientStatus === 'waiting' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClearSeat(seat.seatNumber)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Seat Details Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Seat {selectedSeat.seatNumber}</h3>
            
            {selectedSeat.status === 'occupied' ? (
              <div>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="mb-2"><strong>Patient:</strong> {selectedSeat.patientName}</p>
                  <p className="mb-2"><strong>Phone:</strong> {selectedSeat.patientPhone}</p>
                  <p className="mb-2"><strong>Type:</strong> {selectedSeat.patientType}</p>
                  <p className="mb-2"><strong>Session:</strong> {selectedSeat.session}</p>
                  <p className="mb-2">
                    <strong>Status:</strong>{' '}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedSeat.patientStatus === 'completed'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedSeat.patientStatus || 'Unknown'}
                    </span>
                  </p>
                </div>
                
                {/* Only show clear button for waiting patients */}
                {selectedSeat.patientStatus === 'waiting' && (
                  <button
                    onClick={() => {
                      onClearSeat(selectedSeat.seatNumber)
                      setSelectedSeat(null)
                    }}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mb-2"
                  >
                    Clear Seat
                  </button>
                )}
                
                {selectedSeat.patientStatus === 'completed' && (
                  <div className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mb-2 text-center">
                    Patient Completed - Seat Cannot be Cleared
                  </div>
                )}
              </div>
            ) : (
              <p className="mb-4">This seat is available</p>
            )}
            
            <button
              onClick={() => setSelectedSeat(null)}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SeatLayout