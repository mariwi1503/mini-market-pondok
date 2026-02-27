import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

export default function AppLayout() {
  const location = useLocation();
  const hideHeader = ['/login'].includes(location.pathname);
  const hideBottomNav = ['/login', '/checkout'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <main className={!hideHeader ? 'pt-14 md:pt-16' : ''}>
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
