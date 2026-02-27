import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah } from '@/data/products';

interface Order {
  id: string;
  items: Array<{ name: string; quantity: number; price: number; image: string }>;
  total: number;
  status: string;
  date: string;
  payment: string;
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=orders');
      return;
    }
    const saved = JSON.parse(localStorage.getItem('fm_orders') || '[]');
    setOrders(saved.reverse());
  }, [isAuthenticated]);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    delivered: 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    delivered: 'Selesai',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Pesanan Saya</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">Belum Ada Pesanan</h2>
            <p className="text-sm text-gray-500 mb-6">Yuk mulai belanja kebutuhan Anda!</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#2D6A4F] transition"
            >
              <ShoppingBag size={16} /> Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-gray-800">#{order.id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400">{item.quantity}x {formatRupiah(item.price)}</p>
                      </div>
                      <span className="text-sm font-semibold">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Total Pembayaran</span>
                  <span className="text-base font-bold text-[#1B4332]">{formatRupiah(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="h-20 md:hidden" />
    </div>
  );
}
