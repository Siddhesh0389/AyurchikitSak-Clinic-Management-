import React, { useState } from 'react'
import { useWebSocket } from '../contexts/WebSocketContext'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBell, FaChair, FaUsers, FaClock } from 'react-icons/fa'
import { useAdminData } from '../hooks/useAdminData'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorDisplay from '../components/common/ErrorDisplay'
import AdminStats from '../components/admin/AdminStats'
import RunningNumberControl from '../components/admin/RunningNumberControl'
import SessionControls from '../components/admin/SessionControls'
import AnnouncementBar from '../components/admin/AnnouncementBar'
import SeatLayout from '../components/admin/SeatLayout'
import PendingRequests from '../components/admin/PendingRequests'
import TodayPatients from '../components/admin/TodayPatients'
import ClinicTimings from '../components/admin/ClinicTimings'
import AddPatientModal from '../components/admin/Modals/AddPatientModal'
import ConfirmModal from '../components/admin/Modals/ConfirmModal'

const AdminDashboard = () => {
  // Fix: Destructure connected from useWebSocket
  const { connected } = useWebSocket()
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState('seats')
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  
  const {
    stats,
    seats,
    patients,
    pendingRequests,
    clinicTimings,
    loading,
    error,
    refreshing,
    fetchData,
    updateRunningNumber,
    assignSeat,
    rejectRequest,
    clearSeat,
    clearAllSeats,
    deletePatient,
    addOfflinePatient,
    updateSession,
    updateTimings,
    updateAnnouncement
  } = useAdminData(token, connected) // Pass connected to the hook

  const tabs = [
    { id: 'seats', label: 'Seat Layout', icon: FaChair, count: 0 },
    { id: 'requests', label: 'Pending Requests', icon: FaBell, count: pendingRequests.length },
    { id: 'patients', label: "Today's Patients", icon: FaUsers, count: patients.length },
    { id: 'timings', label: 'Clinic Timings', icon: FaClock, count: 0 }
  ]

  if (loading && !refreshing && patients.length === 0) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchData} />
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto">
        
        {/* Announcement Bar */}
        <AnnouncementBar 
          onUpdate={updateAnnouncement}
          initialMessage={stats.announcement}
        />

        {/* Stats Cards */}
        <AdminStats stats={stats} seats={seats} />

        {/* Controls Row */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <RunningNumberControl 
            runningNumber={stats.currentNumber}
            onUpdate={updateRunningNumber}
          />
          <SessionControls 
            currentSession={clinicTimings.currentSession}
            onUpdate={updateSession}
            onAddPatient={() => setShowAddPatient(true)}
            onClearAll={() => setShowClearConfirm(true)}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600'
                    : 'bg-primary-100 text-primary-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            {activeTab === 'seats' && (
              <SeatLayout 
                seats={seats} 
                onClearSeat={clearSeat}
              />
            )}

            {activeTab === 'requests' && (
              <PendingRequests 
                requests={pendingRequests}
                seats={seats}
                onAssign={assignSeat}
                onReject={rejectRequest}
              />
            )}

            {activeTab === 'patients' && (
              <TodayPatients 
                patients={patients}
                onDelete={(patientId) => setShowDeleteConfirm(patientId)}
              />
            )}

            {activeTab === 'timings' && (
              <ClinicTimings 
                timings={clinicTimings}
                onUpdate={updateTimings}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        <AddPatientModal
          isOpen={showAddPatient}
          onClose={() => setShowAddPatient(false)}
          onAdd={addOfflinePatient}
          seats={seats}
          defaultSession={clinicTimings.currentSession}
        />

        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={clearAllSeats}
          title="Clear All Seats?"
          message="This will remove all seat assignments and mark all today's patients as completed. This action cannot be undone."
          confirmText="Yes, Clear All"
          cancelText="Cancel"
          type="danger"
        />

        <ConfirmModal
          isOpen={!!showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(null)}
          onConfirm={() => {
            deletePatient(showDeleteConfirm)
            setShowDeleteConfirm(null)
          }}
          title="Delete Patient?"
          message="Are you sure you want to delete this patient? This action cannot be undone."
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  )
}

export default AdminDashboard