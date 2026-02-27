import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Phone, Lock, User, Eye, EyeOff, Zap, ArrowRight, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const { login, quickLogin, register } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!phone || !password) {
      setError('Mohon isi semua field');
      return;
    }
    setLoading(true);
    const success = await login(phone, password);
    setLoading(false);
    if (success) {
      navigate(redirect === 'checkout' ? '/checkout' : redirect);
    } else {
      setError('Nomor HP atau password salah');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !phone || !password) {
      setError('Mohon isi semua field');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    const success = await register(name, phone, password);
    setLoading(false);
    if (success) {
      navigate(redirect === 'checkout' ? '/checkout' : redirect);
    } else {
      setError('Nomor HP sudah terdaftar');
    }
  };

  const handleQuickLogin = (role: 'customer' | 'admin') => {
    quickLogin(role);
    navigate(redirect === 'checkout' ? '/checkout' : redirect);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-8 text-white">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-white/80 hover:text-white mb-6">
          <ChevronLeft size={20} />
          <span className="text-sm">Kembali</span>
        </button>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center mx-auto mb-4 text-[#1B4332] font-bold text-xl">
            FB
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {mode === 'login' ? 'Selamat Datang!' : 'Buat Akun Baru'}
          </h1>
          <p className="text-white/70 text-sm">
            {mode === 'login' ? 'Masuk ke akun Anda untuk mulai belanja' : 'Daftar untuk menikmati kemudahan belanja'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 py-8">
        {/* Quick Login */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 text-center">Login Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="flex items-center gap-2 p-3 bg-[#E8F5E9] rounded-xl hover:bg-[#C8E6C9] transition group"
            >
              <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-[#D4AF37]" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#1B4332]">Santri</p>
                <p className="text-[10px] text-gray-500">Demo akun</p>
              </div>
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="flex items-center gap-2 p-3 bg-[#FFF8E1] rounded-xl hover:bg-[#FFECB3] transition group"
            >
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#B8941F]">Admin</p>
                <p className="text-[10px] text-gray-500">Demo akun</p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">atau</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              mode === 'login' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-400'
            }`}
          >
            Masuk
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
              mode === 'register' ? 'bg-white text-[#1B4332] shadow-sm' : 'text-gray-400'
            }`}
          >
            Daftar
          </button>
        </div>

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Lengkap</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nomor HP</label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pl-11 pr-11 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-medium p-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B4332] text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#2D6A4F] disabled:opacity-50 transition"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Masuk' : 'Daftar'} <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <div className="mt-4 text-center">
            <button className="text-xs text-[#1B4332] font-medium hover:underline">
              Lupa Password?
            </button>
          </div>
        )}

        {/* Demo credentials */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>Santri: 081234567890 / password</p>
            <p>Admin: 081298765432 / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
