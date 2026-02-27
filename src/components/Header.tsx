import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, ChevronLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSearch?: boolean;
}

export default function Header({ title, showBack = false, showSearch = true }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const itemCount = getItemCount();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 h-14 md:h-16">
            {/* Left */}
            <div className="flex items-center gap-2">
              {showBack ? (
                <button onClick={() => navigate(-1)} className="p-1.5 -ml-1.5 rounded-full hover:bg-white/10 transition">
                  <ChevronLeft size={24} />
                </button>
              ) : (
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 -ml-1.5 rounded-full hover:bg-white/10 transition md:hidden">
                  {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              )}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-[#1B4332] text-sm">
                  FB
                </div>
                <span className="font-bold text-sm md:text-base hidden sm:block">
                  {title || 'Mini Market Faiz Al Baqarah'}
                </span>
                <span className="font-bold text-sm sm:hidden">
                  {title || 'Faiz Al Baqarah'}
                </span>
              </Link>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/" className="hover:text-[#D4AF37] transition">Beranda</Link>
              <Link to="/categories" className="hover:text-[#D4AF37] transition">Kategori</Link>
              <Link to="/articles" className="hover:text-[#D4AF37] transition">Artikel</Link>
              <Link to="/promo" className="hover:text-[#D4AF37] transition">Promo</Link>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-1">
              {showSearch && (
                <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-full hover:bg-white/10 transition">
                  <Search size={20} />
                </button>
              )}
              <Link to="/cart" className="p-2 rounded-full hover:bg-white/10 transition relative">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#1B4332] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
              <Link to={isAuthenticated ? '/profile' : '/login'} className="p-2 rounded-full hover:bg-white/10 transition">
                <User size={20} />
              </Link>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="px-4 pb-3 animate-in slide-in-from-top duration-200">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari produk..."
                  autoFocus
                  className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/60 rounded-full px-4 py-2.5 pl-10 text-sm outline-none focus:bg-white/20 transition"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" />
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white p-6 pt-16">
              {isAuthenticated ? (
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1B4332] font-bold text-lg mb-3">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-white/70">{user?.phone}</p>
                </div>
              ) : (
                <div>
                  <p className="font-semibold mb-2">Selamat Datang!</p>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="text-sm bg-[#D4AF37] text-[#1B4332] px-4 py-1.5 rounded-full font-medium inline-block">
                    Masuk / Daftar
                  </Link>
                </div>
              )}
            </div>
            <nav className="p-4 space-y-1">
              {[
                { to: '/', label: 'Beranda' },
                { to: '/categories', label: 'Semua Kategori' },
                { to: '/promo', label: 'Promo' },
                { to: '/articles', label: 'Artikel' },
                { to: '/cart', label: 'Keranjang' },
                { to: '/orders', label: 'Pesanan Saya' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-[#E8F5E9] hover:text-[#1B4332] font-medium transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
