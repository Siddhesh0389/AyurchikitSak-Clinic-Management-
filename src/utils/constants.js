// Use environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Socket URL for WebSocket connections
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080'

// Session types
export const SESSION_TYPES = {
  MORNING: 'morning',
  EVENING: 'evening'
}

// Patient types
export const PATIENT_TYPES = {
  OFFLINE: 'offline',
  ONLINE: 'online'
}

// Patient status
export const PATIENT_STATUS = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

// Request status for bookings
export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

// Session status from backend
export const SESSION_STATUS = {
  MORNING: 'MORNING',
  EVENING: 'EVENING',
  CLOSED: 'CLOSED'
}

// API endpoints (relative paths)
export const API_ENDPOINTS = {
  // Public endpoints
  PUBLIC: {
    LIVE_STATUS: '/public/live-status',
    BOOKING_REQUEST: '/public/booking/request',
    BOOKING_STATUS: (id) => `/public/booking/status/${id}`,
    CHECK_SEAT: (phone) => `/public/check-seat/${phone}`,
    CLINIC_INFO: '/public/clinic-info',
    ANNOUNCEMENT: '/public/announcement'
  },
  
  // Admin endpoints
  ADMIN: {
    DASHBOARD_STATS: '/admin/dashboard/stats',
    PATIENTS_TODAY: '/admin/patients/today',
    PENDING_REQUESTS: '/admin/requests/pending',
    SEATS: '/admin/seats',
    ASSIGN_SEAT: '/admin/assign-seat',
    REJECT_REQUEST: (id) => `/admin/reject-request/${id}`,
    CLEAR_SEAT: (seat) => `/admin/clear-seat/${seat}`,
    CLEAR_ALL_SEATS: '/admin/clear-all-seats',
    DELETE_PATIENT: (id) => `/admin/patients/${id}`,
    RUNNING_NUMBER: '/admin/running-number',
    SESSION_UPDATE: '/admin/session/update',
    TIMINGS: '/admin/timings',
    ANNOUNCEMENT: '/admin/announcement',
    CURRENT_ANNOUNCEMENT: '/admin/current-announcement',
    DELETE_ANNOUNCEMENT: (id) => `/admin/announcement/${id}`,
    LIVE_STATUS: '/admin/live-status'
  },
  
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login'
  }
}

// Color palette
export const COLORS = {
  primary: {
    50: '#f0f9f0',
    100: '#dcf0dc',
    200: '#b9e0b9',
    300: '#8fc98f',
    400: '#65b365',
    500: '#4a9e4a',
    600: '#3a7f3a',
    700: '#2f662f',
    800: '#275227',
    900: '#204320',
  },
  secondary: {
    50: '#fff8e7',
    100: '#feefc3',
    200: '#fddf8a',
    300: '#fcc74a',
    400: '#fbaf23',
    500: '#f58e0b',
    600: '#d96b06',
    700: '#b44a09',
    800: '#923a0e',
    900: '#78300f',
  },
  // Session colors
  session: {
    morning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-500',
      gradient: 'from-yellow-400 to-orange-500'
    },
    evening: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-800',
      border: 'border-indigo-500',
      gradient: 'from-indigo-400 to-purple-500'
    },
    closed: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-500',
      gradient: 'from-gray-400 to-gray-600'
    }
  },
  // Status colors
  status: {
    waiting: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    completed: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      badge: 'bg-green-100 text-green-800'
    },
    inProgress: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      badge: 'bg-blue-100 text-blue-800'
    },
    cancelled: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      badge: 'bg-red-100 text-red-800'
    }
  }
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  LAST_BOOKING_PHONE: 'lastBookingPhone'
}

// Default values
export const DEFAULTS = {
  TOTAL_SEATS: 100,
  RUNNING_NUMBER: 1,
  MORNING_START: '09:30',
  MORNING_END: '13:00',
  EVENING_START: '17:00',
  EVENING_END: '21:00',
  SUNDAY_HOLIDAY: true,
  CURRENT_SESSION: 'morning'
}

// Validation rules
export const VALIDATION = {
  PHONE_REGEX: /^[0-9]{10}$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  AGE_MIN: 1,
  AGE_MAX: 120,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 500
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  SLOTS_FULL: 'Sorry, today\'s slots are full.',
  DUPLICATE_BOOKING: 'You already have a booking for today.',
  INVALID_PHONE: 'Please enter a valid 10-digit phone number.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Booking request submitted successfully!',
  SEAT_ASSIGNED: (seat) => `Seat ${seat} assigned successfully`,
  PATIENT_ADDED: 'Patient added successfully',
  SEAT_CLEARED: (seat) => `Seat ${seat} cleared`,
  ALL_SEATS_CLEARED: 'All seats cleared for new batch',
  TIMINGS_UPDATED: 'Timings updated successfully',
  ANNOUNCEMENT_UPDATED: 'Announcement updated successfully',
  ANNOUNCEMENT_DELETED: 'Announcement deleted successfully',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully'
}

// Export all constants
export default {
  API_BASE_URL,
  SOCKET_URL,
  SESSION_TYPES,
  PATIENT_TYPES,
  PATIENT_STATUS,
  REQUEST_STATUS,
  SESSION_STATUS,
  API_ENDPOINTS,
  COLORS,
  STORAGE_KEYS,
  DEFAULTS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
}