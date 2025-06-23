import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';

export default function Layout() {
  return (
    <div>
      <Menu />
      <div style={{ padding: '1rem' }}>
        <Outlet />
      </div>
    </div>
  );
}
