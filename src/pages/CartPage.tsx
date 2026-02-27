import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatRupiah, getDiscountedPrice } from '@/data/products';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getSubtotal, getTotal, getItemCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Keranjang Kosong</h2>
          <p className="text-sm text-gray-500 mb-6">Belum ada produk di keranjang belanja Anda</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#2D6A4F] transition"
          >
            <ShoppingCart size={16} /> Mulai Belanja
          </Link>
        </div>
        <div className="h-20 md:hidden" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-800">Keranjang ({getItemCount()} item)</h1>
          <button onClick={clearCart} className="text-xs text-red-500 font-medium hover:underline">
            Hapus Semua
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          {items.map(item => {
            const discountedPrice = getDiscountedPrice(item.product.price, item.product.discount);
            return (
              <div key={item.product.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <Link to={`/product/${item.product.handle}`} className="flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.handle}`}>
                      <h3 className="text-sm font-semibold text-gray-800 truncate hover:text-[#1B4332] transition">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{item.product.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[#1B4332]">{formatRupiah(discountedPrice)}</span>
                      {item.product.discount && (
                        <span className="text-xs text-gray-400 line-through">{formatRupiah(item.product.price)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#1B4332] hover:bg-[#C8E6C9] transition"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-800">
                          {formatRupiah(discountedPrice * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="font-semibold text-gray-800 mb-4">Ringkasan Belanja</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal ({getItemCount()} item)</span>
              <span className="font-medium">{formatRupiah(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Ongkos Kirim</span>
              <span className="font-medium text-green-600">Gratis</span>
            </div>
            <div className="border-t border-gray-100 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-lg text-[#1B4332]">{formatRupiah(getTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Free shipping badge */}
        <div className="bg-[#E8F5E9] rounded-xl p-3 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#1B4332] flex items-center justify-center flex-shrink-0">
            <ShoppingBag size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1B4332]">Gratis Ongkir</p>
            <p className="text-[10px] text-[#2D6A4F]">Berlaku untuk semua pesanan</p>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-[#1B4332] text-white py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#2D6A4F] active:scale-[0.98] transition-all shadow-lg shadow-[#1B4332]/20"
        >
          Lanjut ke Pembayaran <ArrowRight size={16} />
        </button>
      </div>

      <div className="h-24 md:hidden" />
    </div>
  );
}
