import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../../context/NotificationContext.jsx'

export default function Home() {
  const navigate = useNavigate()
  const { notificacao, setNotificacao } = useNotification()

  const entrarNaReuniao = () => {
    if (notificacao) {
      navigate(`/consulta/${notificacao.meetingId}/${notificacao.userId}`)
      setNotificacao(null) // limpa a notificação
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Bem-vindo à Home</h2>
        {notificacao && (
          <button onClick={entrarNaReuniao} style={{ background: 'gold', padding: 10 }}>
            🔔 Nova Reunião!
          </button>
        )}
 
      </div>
 
    </div>
  )
}
