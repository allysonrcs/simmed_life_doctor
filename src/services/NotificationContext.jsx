import React from 'react'
import { createContext, useContext, useState, useEffect } from 'react'
import { getMessaging, onMessage } from 'firebase/messaging'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notificacao, setNotificacao] = useState(null)

  useEffect(() => {
    const messaging = getMessaging()

    const unsubscribe = onMessage(messaging, (payload) => {
      const data = payload.data || {}
      if (data.tipo === 'consulta' && data.meetingId) {
        const usuarioId = localStorage.getItem('usuarioId')
        setNotificacao({
          title: payload.notification?.title || 'Nova reunião',
          meetingId: data.meetingId,
          userId: usuarioId,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <NotificationContext.Provider value={{ notificacao, setNotificacao }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
