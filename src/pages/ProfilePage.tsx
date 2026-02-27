import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, MapPin, LogOut, ChevronRight, Package, Heart, Settings, HelpCircle, Shield, Bell, Edit2, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah } from '@/data/products';

interface Order {
  id: string;
  items: Array<{ name: string; quantity: number; price: number; image: string }>;
  total: number;
  shipping: { name: string; phone: string; address: string };
  payment: string;
  status: string;
  date: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const saved = JSON.parse(localStorage.getItem('fm_orders') || '[]');
    setOrders(saved.reverse());
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = () => {
    updateProfile({ name: editName, address: editAddress });
    setEditing(false);
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    processing: 'Diproses',
    shipped: 'Dikirim',
    delivered: 'Selesai',
    cancelled: 'Dibatalkan',
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white px-4 pt-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1B4332] font-bold text-2xl flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              {editing ? (
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="bg-white/10 rounded-lg px-3 py-1 text-white text-lg font-bold outline-none w-full"
                />
              ) : (
                <h1 className="text-lg font-bold">{user.name}</h1>
              )}
              <p className="text-white/70 text-sm flex items-center gap-1">
                <Phone size={12} /> {user.phone}
              </p>
            </div>
            <button
              onClick={() => editing ? handleSaveProfile() : setEditing(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              {editing ? <Check size={18} /> : <Edit2 size={18} />}
            </button>
          </div>
          {editing && (
            <div className="mt-3">
              <textarea
                value={editAddress}
                onChange={e => setEditAddress(e.target.value)}
                placeholder="Alamat lengkap..."
                className="w-full bg-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/50 outline-none resize-none"
                rows={2}
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-[#1B4332]">{orders.length}</p>
            <p className="text-xs text-gray-500">Pesanan</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <p className="text-lg font-bold text-[#1B4332]">{orders.filter(o => o.status === 'pending').length}</p>
            <p className="text-xs text-gray-500">Menunggu</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-[#1B4332]">
              {formatRupiah(orders.reduce((sum, o) => sum + o.total, 0))}
            </p>
            <p className="text-xs text-gray-500">Total Belanja</p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
          {[
            { icon: Package, label: 'Pesanan Saya', action: () => setActiveTab('orders'), active: activeTab === 'orders' },
            { icon: Heart, label: 'Wishlist', action: () => setActiveTab('wishlist') },
            { icon: MapPin, label: 'Alamat Tersimpan', action: () => setActiveTab('address') },
            { icon: Bell, label: 'Notifikasi', action: () => {} },
            { icon: Settings, label: 'Pengaturan', action: () => {} },
            { icon: HelpCircle, label: 'Bantuan', action: () => {} },
            { icon: Shield, label: 'Kebijakan Privasi', action: () => {} },
          ].map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition border-b border-gray-50 last:border-0"
            >
              <item.icon size={18} className="text-[#1B4332]" />
              <span className="flex-1 text-left text-sm font-medium text-gray-700">{item.label}</span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === 'orders' && (
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Riwayat Pesanan</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <Package size={40} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">Belum ada pesanan</p>
                <Link to="/" className="text-[#1B4332] text-sm font-semibold hover:underline">
                  Mulai Belanja
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400">#{order.id}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.quantity}x {formatRupiah(item.price)}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-400">+{order.items.length - 2} produk lainnya</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Total</span>
                      <span className="text-sm font-bold text-[#1B4332]">{formatRupiah(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white text-red-500 py-3.5 rounded-2xl font-semibold text-sm shadow-sm hover:bg-red-50 transition mb-4"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
