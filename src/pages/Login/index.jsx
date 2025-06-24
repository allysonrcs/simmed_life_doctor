import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import './Login.css'; // Importa o CSS

const firebaseConfig = {
  apiKey: "AIzaSyBmbOSv-VzwquztgfiJ4UQJYivpi1YAlBE",
  authDomain: "sim-med-6881d.firebaseapp.com",
  projectId: "sim-med-6881d",
  storageBucket: "sim-med-6881d.firebasestorage.app",
  messagingSenderId: "978516162485",
  appId: "1:978516162485:web:b4a061e22a85bb5872cbfc",
  measurementId: "G-7752L5YB37"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const vapidKey = 'BITY2ssa8DgqRp-Ivu7h0-0Wt8Hekyi5lky7H7obGNf6bEp3CeGLZ5YFx2L0edMynjMz3qfSafz43jLj8hcPMvE';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [fcmToken, setFcmToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getFcmToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        const sw = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: sw
        });

        setFcmToken(token);
      } catch (e) {
        console.error('Erro ao pegar token FCM:', e);
      } finally {
        setLoadingToken(false);
      }
    };

    getFcmToken();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await fetch('/api/autenticacao/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, fcmToken }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', 'true');
      localStorage.setItem('nomeUsuario', data.UsuarioName);
      localStorage.setItem('usuarioId', data.UsuarioId);
      localStorage.setItem('usuarioEmail', data.UsuarioEmail);
      navigate('/home');
    } catch {
      alert('Usuário ou senha inválidos');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input"
        />

        <div className="password-container">
          <input
            type={showSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            className="input password-input"
          />
          <button
            onClick={() => setShowSenha(!showSenha)}
            className="toggle-button"
            type="button"
            aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {showSenha ? '🙈' : '👁️'}
          </button>
        </div>

 
        <button
          onClick={handleLogin}
          disabled={loadingToken}
          className={`button ${loadingToken ? 'disabled' : ''}`}
          type="button"
        >
          {loadingToken ? 'Carregando...' : 'Entrar'}
        </button>
 
        <button
          onClick={handleLogin}
          disabled={!fcmToken && !loadingToken}
          className={`button ${(!fcmToken && !loadingToken) ? 'disabled' : ''}`}
          type="button"
        >
          {loadingToken ? 'Carregando...' : 'Entrar'}
        </button>
 

        <div className="links">
          <a href="#!" className="link">Esqueci a senha</a>
          <a href="#!" className="link">Criar conta</a>
        </div>
      </div>
    </div>
  );
}
