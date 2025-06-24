import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Menu() {
  const navigate = useNavigate();
 
  const logout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };
 

  return (
    <div
      style={{
        width: '200px',
        background: '#f0f0f0',
        padding: '1rem',
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li style={{ marginTop: '1rem' }}>
          <button onClick={logout}>Sair</button>
        </li>
      </ul>
    </div>

  );
}
