import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { getMessaging, onMessage } from 'firebase/messaging'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Consultorio from './pages/Consultorio'
import Layout from './layout/Layout'
import { useNotification } from './context/NotificationContext'
import './app.css'; 

function App() {
  const navigate = useNavigate();
  const { notificacao, setNotificacao } = useNotification()

  useEffect(() => {
    const messaging = getMessaging();
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Mensagem recebida no foreground:', payload);
      const data = payload.data || {};
      const usuarioId = localStorage.getItem('usuarioId');
      
      if (data.tipo === 'consulta' && data.meetingId) {
        setNotificacao({
          title: payload.notification?.title || 'Nova reunião',
          meetingId: data.meetingId,
          userId: usuarioId,
        })
      } else {
        alert(`Nova notificação: ${payload.notification?.title || 'Sem título'}`);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route
          path="/consulta/:meetingId/:userId"
          element={
            <PrivateRoute>
              <Consultorio />
            </PrivateRoute>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
