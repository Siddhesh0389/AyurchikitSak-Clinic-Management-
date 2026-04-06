import React, { createContext, useContext, useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import toast from 'react-hot-toast'

// Get Socket URL from environment variable
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080'

const WebSocketContext = createContext()

export const useWebSocket = () => useContext(WebSocketContext)

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null)
  const [connected, setConnected] = useState(false)
  const [liveData, setLiveData] = useState({
    currentNumber: 1,
    totalPatients: 0,
    availableSeats: 100,
    occupiedSeats: 0,
    sessionStatus: 'CLOSED',
    currentSession: 'morning',
    clinicOpen: false,
    morningCount: 0,
    eveningCount: 0
  })
  const [seats, setSeats] = useState([])

  // Log the Socket URL being used (for debugging)
  console.log('WebSocket URL:', SOCKET_URL)

  useEffect(() => {
    // Create SockJS connection using environment variable
    const socketUrl = `${SOCKET_URL}/ws`
    console.log('Connecting to WebSocket at:', socketUrl)
    
    const socket = new SockJS(socketUrl)
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // Only log in development
        if (import.meta.env.DEV) {
          console.log('STOMP: ' + str)
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true)
        console.log('✅ WebSocket Connected to:', socketUrl)
        
        client.subscribe('/topic/live-status', (message) => {
          try {
            const data = JSON.parse(message.body)
            console.log('Live status update:', data)
            setLiveData(prev => ({ ...prev, ...data }))
            
            // Show notification for important updates
            if (data.currentNumber && data.currentNumber !== liveData.currentNumber) {
              toast.success(`Now Serving: ${data.currentNumber}`, {
                icon: '🔔',
                duration: 3000
              })
            }
          } catch (error) {
            console.error('Error parsing live status:', error)
          }
        })

        client.subscribe('/topic/seats', (message) => {
          try {
            const data = JSON.parse(message.body)
            console.log('Seats update received:', data)
            setSeats(data)
          } catch (error) {
            console.error('Error parsing seats:', error)
          }
        })

        client.subscribe('/topic/dashboard', (message) => {
          try {
            const data = JSON.parse(message.body)
            console.log('Dashboard update:', data)
          } catch (error) {
            console.error('Error parsing dashboard:', error)
          }
        })
      },
      onDisconnect: () => {
        setConnected(false)
        console.log('❌ WebSocket Disconnected from:', socketUrl)
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame)
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event)
      }
    })

    client.activate()
    setStompClient(client)

    return () => {
      if (client && client.active) {
        client.deactivate()
        console.log('WebSocket deactivated')
      }
    }
  }, [])

  const sendMessage = (destination, message) => {
    if (stompClient && connected && stompClient.active) {
      try {
        stompClient.publish({
          destination: `/app${destination}`,
          body: JSON.stringify(message)
        })
        console.log(`Message sent to ${destination}:`, message)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    } else {
      console.warn('Cannot send message - WebSocket not connected')
    }
  }

  const value = {
    connected,
    liveData,
    seats,
    sendMessage,
    stompClient
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}