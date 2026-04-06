import React from 'react'
import { FaSun, FaMoon, FaSave } from 'react-icons/fa'

const ClinicTimings = ({ timings, onUpdate }) => {
  const [localTimings, setLocalTimings] = React.useState(timings)

  React.useEffect(() => {
    setLocalTimings(timings)
  }, [timings])

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Clinic Timings & Settings
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-primary-700">Morning Session</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                value={localTimings.morningStart}
                onChange={(e) => setLocalTimings({...localTimings, morningStart: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                value={localTimings.morningEnd}
                onChange={(e) => setLocalTimings({...localTimings, morningEnd: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-secondary-700">Evening Session</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                value={localTimings.eveningStart}
                onChange={(e) => setLocalTimings({...localTimings, eveningStart: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                value={localTimings.eveningEnd}
                onChange={(e) => setLocalTimings({...localTimings, eveningEnd: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={localTimings.sundayHoliday}
              onChange={(e) => setLocalTimings({...localTimings, sundayHoliday: e.target.checked})}
              className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-gray-700">Sunday Holiday</span>
          </label>
        </div>

        <div className="md:col-span-2">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">Default Session</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => setLocalTimings({...localTimings, currentSession: 'morning'})}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                localTimings.currentSession === 'morning'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaSun className="inline mr-2" />
              Morning
            </button>
            <button
              onClick={() => setLocalTimings({...localTimings, currentSession: 'evening'})}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                localTimings.currentSession === 'evening'
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaMoon className="inline mr-2" />
              Evening
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            onClick={() => onUpdate(localTimings)}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all"
          >
            <FaSave className="inline mr-2" />
            Save Timings
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClinicTimings