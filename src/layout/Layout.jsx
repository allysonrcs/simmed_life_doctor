import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';

export default function Layout() {
  return (
    <div style={{ display: 'flex' }}>
      <Menu />
      <div style={{ flex: 1, padding: '1rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
