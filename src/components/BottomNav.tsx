import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingCart, Newspaper, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function BottomNav() {
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const tabs = [
    { to: '/', icon: Home, label: 'Beranda' },
    { to: '/categories', icon: Grid3X3, label: 'Kategori' },
    { to: '/cart', icon: ShoppingCart, label: 'Keranjang', badge: itemCount },
    { to: '/articles', icon: Newspaper, label: 'Artikel' },
    { to: '/profile', icon: User, label: 'Profil' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(tab => {
          const active = isActive(tab.to);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all ${
                active ? 'text-[#1B4332]' : 'text-gray-400'
              }`}
            >
              <div className="relative">
                {active && (
                  <div className="absolute -inset-2 bg-[#E8F5E9] rounded-full -z-10" />
                )}
                <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] ${active ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
