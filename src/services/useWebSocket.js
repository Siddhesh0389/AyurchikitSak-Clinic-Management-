import { useEffect, useState, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import toast from 'react-hot-toast'

const useWebSocket = () => {
  const [connected, setConnected] = useState(false)
  const [stompClient, setStompClient] = useState(null)
  const [messages, setMessages] = useState([])
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
  
  const isActive = useRef(false)

  const connect = useCallback(() => {
    if (isActive.current) return
    
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080'
    console.log('Connecting to WebSocket at:', socketUrl)
    
    const socket = new SockJS(`${socketUrl}/ws`)
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        // Only log in development
        if (import.meta.env.DEV) {
          console.log('STOMP:', str)
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectionTimeout: 10000,
    })

    client.onConnect = () => {
      setConnected(true)
      isActive.current = true
      console.log('✅ WebSocket connected to:', socketUrl)
      toast.success('Connected to live updates')

      // Subscribe to live status updates
      client.subscribe('/topic/live-status', (message) => {
        try {
          const data = JSON.parse(message.body)
          setLiveData(prev => ({ ...prev, ...data }))
          
          // Show notification for important updates
          if (data.currentNumber !== liveData.currentNumber) {
            toast.success(`Now Serving: ${data.currentNumber}`, {
              icon: '🔔',
              duration: 3000
            })
          }
        } catch (error) {
          console.error('Error parsing live status:', error)
        }
      })

      // Subscribe to seat updates
      client.subscribe('/topic/seats', (message) => {
        try {
          const data = JSON.parse(message.body)
          setSeats(data)
        } catch (error) {
          console.error('Error parsing seats:', error)
        }
      })

      // Subscribe to dashboard updates
      client.subscribe('/topic/dashboard', (message) => {
        try {
          const data = JSON.parse(message.body)
          console.log('Dashboard update:', data)
        } catch (error) {
          console.error('Error parsing dashboard:', error)
        }
      })

      // Subscribe to session status updates
      client.subscribe('/topic/session-status', (message) => {
        try {
          const data = JSON.parse(message.body)
          setLiveData(prev => ({ ...prev, sessionStatus: data }))
        } catch (error) {
          console.error('Error parsing session status:', error)
        }
      })

      // Subscribe to public messages (existing)
      client.subscribe('/topic/public', (message) => {
        setMessages(prev => [...prev, JSON.parse(message.body)])
      })
    }

    client.onDisconnect = () => {
      setConnected(false)
      isActive.current = false
      console.log('❌ WebSocket disconnected')
      toast.error('Disconnected from live updates')
    }

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame)
      toast.error('Connection error')
    }

    client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event)
    }

    client.activate()
    setStompClient(client)

    return client
  }, [liveData.currentNumber])

  useEffect(() => {
    const client = connect()

    // Cleanup on unmount
    return () => {
      if (client && client.active) {
        client.deactivate()
      }
    }
  }, [connect])

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
        toast.error('Failed to send message')
      }
    } else {
      console.warn('Cannot send message: WebSocket not connected')
      toast.error('Not connected to server')
    }
  }

  const reconnect = () => {
    if (stompClient) {
      stompClient.deactivate()
    }
    connect()
  }

  return { 
    connected, 
    sendMessage, 
    messages,
    liveData,
    seats,
    reconnect
  }
}

export default useWebSocket