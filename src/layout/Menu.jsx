import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Menu() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/home" style={{ marginRight: '1rem' }}>Home</Link>
      <button onClick={logout}>Sair</button>
    </nav>
  );
}
