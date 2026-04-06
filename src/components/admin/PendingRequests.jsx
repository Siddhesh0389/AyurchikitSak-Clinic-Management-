import React, { useState } from 'react'
import { FaBell, FaPhone, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import toast from 'react-hot-toast'

const PendingRequests = ({ requests, seats, onAssign, onReject }) => {
  const [selectedSeatForRequest, setSelectedSeatForRequest] = useState({})

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No pending requests</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Pending Booking Requests ({requests.length})
      </h2>
      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="bg-gray-50 rounded-xl p-4 border-l-4 border-yellow-400">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{request.name}</h3>
                <p className="text-gray-600 text-sm flex items-center">
                  <FaPhone className="mr-1" /> {request.phone}
                </p>
                <p className="text-gray-500 text-sm mt-1">{request.complaint}</p>
                <div className="flex items-center mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full mr-2 ${
                    request.preferredSession === 'morning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}>
                    {request.preferredSession}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 min-w-[120px]"
                  value={selectedSeatForRequest[request.id] || ''}
                  onChange={(e) => setSelectedSeatForRequest({
                    ...selectedSeatForRequest,
                    [request.id]: e.target.value
                  })}
                >
                  <option value="">Select Seat</option>
                  {seats
                    .filter(s => s.status === 'available')
                    .map(seat => (
                      <option key={seat.seatNumber} value={seat.seatNumber}>
                        Seat {seat.seatNumber}
                      </option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const seatNum = selectedSeatForRequest[request.id]
                      if (seatNum) {
                        onAssign(request.id, parseInt(seatNum), request.preferredSession)
                      } else {
                        toast.error('Please select a seat')
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                  >
                    <FaCheckCircle />
                    <span className="sm:hidden">Assign</span>
                  </button>
                  
                  <button
                    onClick={() => onReject(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1 flex-1 sm:flex-initial"
                  >
                    <FaTimesCircle />
                    <span className="sm:hidden">Reject</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PendingRequests