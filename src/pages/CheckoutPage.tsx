import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, Check, Loader2, Lock, AlertTriangle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatRupiah, getDiscountedPrice } from '@/data/products';

// Initialize Stripe with connected account
const STRIPE_ACCOUNT_ID = 'STRIPE_ACCOUNT_ID';
const stripePromise = STRIPE_ACCOUNT_ID && STRIPE_ACCOUNT_ID !== 'STRIPE_ACCOUNT_ID'
  ? loadStripe('pk_live_51OJhJBHdGQpsHqInIzu7c6PzGPSH0yImD4xfpofvxvFZs0VFhPRXZCyEgYkkhOtBOXFWvssYASs851mflwQvjnrl00T6DbUwWZ', { stripeAccount: STRIPE_ACCOUNT_ID })
  : null;

type Step = 'shipping' | 'payment' | 'processing' | 'success';

// ─── Stripe Payment Form Component ───────────────────────────────────────────
function StripePaymentForm({ onSuccess, total }: { onSuccess: (paymentIntent: any) => void; total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    const { error: submitError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message || 'Pembayaran gagal. Silakan coba lagi.');
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Lock size={16} className="text-[#1B4332]" />
          <h3 className="font-bold text-gray-800 text-sm">Pembayaran Aman</h3>
        </div>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-[#1B4332] text-white py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#2D6A4F] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-lg shadow-[#1B4332]/20"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Memproses Pembayaran...
          </>
        ) : (
          <>
            <Lock size={16} /> Bayar Sekarang — {formatRupiah(total)}
          </>
        )}
      </button>
      <p className="text-center text-[10px] text-gray-400">
        Pembayaran diproses secara aman oleh Stripe. Data kartu Anda terenkripsi.
      </p>
    </form>
  );
}

// ─── Main Checkout Page ──────────────────────────────────────────────────────
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, clearCart, getItemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>('shipping');
  const [shipping, setShipping] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    notes: '',
  });
  const [orderId, setOrderId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [useStripePayment, setUseStripePayment] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    if (items.length === 0 && step !== 'success') {
      navigate('/cart');
    }
  }, [isAuthenticated, items.length, step]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.name || !shipping.phone || !shipping.address) return;

    // Create PaymentIntent when moving to payment step
    if (stripePromise && useStripePayment) {
      createPaymentIntent();
    }
    setStep('payment');
  };

  const createPaymentIntent = async () => {
    const total = getTotal();
    if (total <= 0) return;

    // Convert IDR to cents for Stripe (Stripe uses smallest currency unit)
    // For IDR, the smallest unit is already the rupiah itself
    const amount = total;

    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          amount,
          currency: 'idr',
          metadata: {
            customer_name: shipping.name,
            customer_phone: shipping.phone,
            item_count: getItemCount().toString(),
          },
        },
      });

      if (error) {
        console.error('Payment intent error:', error);
        setPaymentError('Gagal menginisialisasi pembayaran. Silakan coba lagi.');
        return;
      }

      if (data?.clientSecret) {
        setClientSecret(data.clientSecret);
        setPaymentIntentId(data.paymentIntentId);
      } else {
        setPaymentError('Gagal menginisialisasi pembayaran. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Payment intent error:', err);
      setPaymentError('Gagal menginisialisasi pembayaran.');
    }
  };

  // ─── Handle Stripe Payment Success ──────────────────────────────────────
  const handleStripePaymentSuccess = async (paymentIntent: any) => {
    setStep('processing');

    try {
      const total = getTotal();
      const subtotal = getSubtotal();

      // Step 1: Create or find customer in ecom_customers
      const { data: customer } = await supabase
        .from('ecom_customers')
        .upsert(
          {
            email: shipping.email || `${shipping.phone}@minimarket.local`,
            name: shipping.name,
            phone: shipping.phone,
            address: {
              line1: shipping.address,
              notes: shipping.notes,
            },
          },
          { onConflict: 'email' }
        )
        .select('id')
        .single();

      // Step 2: Create order in ecom_orders with status 'paid'
      const { data: order } = await supabase
        .from('ecom_orders')
        .insert({
          customer_id: customer?.id,
          status: 'paid',
          subtotal: subtotal,
          tax: 0,
          shipping: 0,
          total: total,
          shipping_address: {
            name: shipping.name,
            phone: shipping.phone,
            line1: shipping.address,
            notes: shipping.notes,
          },
          stripe_payment_intent_id: paymentIntent.id,
        })
        .select('id')
        .single();

      const dbOrderId = order?.id;

      if (dbOrderId) {
        // Step 3: Create order items in ecom_order_items
        const orderItems = items.map((item) => ({
          order_id: dbOrderId,
          product_id: item.product.id,
          variant_id: null,
          product_name: item.product.name,
          variant_title: null,
          sku: item.product.handle,
          quantity: item.quantity,
          unit_price: getDiscountedPrice(item.product.price, item.product.discount),
          total: getDiscountedPrice(item.product.price, item.product.discount) * item.quantity,
        }));

        await supabase.from('ecom_order_items').insert(orderItems);

        // Step 4: Send order confirmation email
        try {
          await supabase.functions.invoke('send-order-confirmation', {
            body: {
              orderId: dbOrderId,
              customerEmail: shipping.email || `${shipping.phone}@minimarket.local`,
              customerName: shipping.name,
              orderItems: orderItems.map((oi) => ({
                product_name: oi.product_name,
                variant_title: oi.variant_title,
                quantity: oi.quantity,
                unit_price: oi.unit_price,
                total: oi.total,
              })),
              subtotal: subtotal,
              shipping: 0,
              tax: 0,
              total: total,
              shippingAddress: {
                name: shipping.name,
                phone: shipping.phone,
                line1: shipping.address,
                notes: shipping.notes,
              },
            },
          });
        } catch (emailErr) {
          console.error('Email send error (non-blocking):', emailErr);
        }

        setOrderId(dbOrderId.slice(0, 8).toUpperCase());
      } else {
        // Fallback: use paymentIntent id as order reference
        setOrderId(paymentIntent.id.slice(-8).toUpperCase());
      }

      // Step 5: Also save to localStorage for the orders page
      const localOrders = JSON.parse(localStorage.getItem('fm_orders') || '[]');
      localOrders.push({
        id: dbOrderId || paymentIntent.id,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: getDiscountedPrice(i.product.price, i.product.discount),
          image: i.product.image,
        })),
        total: total,
        shipping,
        payment: 'stripe',
        status: 'paid',
        date: new Date().toISOString(),
      });
      localStorage.setItem('fm_orders', JSON.stringify(localOrders));

      clearCart();
      setStep('success');
    } catch (err) {
      console.error('Order creation error:', err);
      // Even if DB fails, payment was successful — show success
      setOrderId(paymentIntent.id.slice(-8).toUpperCase());

      const localOrders = JSON.parse(localStorage.getItem('fm_orders') || '[]');
      localOrders.push({
        id: paymentIntent.id,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: getDiscountedPrice(i.product.price, i.product.discount),
          image: i.product.image,
        })),
        total: getTotal(),
        shipping,
        payment: 'stripe',
        status: 'paid',
        date: new Date().toISOString(),
      });
      localStorage.setItem('fm_orders', JSON.stringify(localOrders));

      clearCart();
      setStep('success');
    }
  };

  // ─── Handle COD / Simulated Payment ─────────────────────────────────────
  const handleSimulatedPayment = () => {
    setStep('processing');
    setTimeout(() => {
      const id = 'ORD-' + Date.now().toString(36).toUpperCase();
      setOrderId(id);

      const localOrders = JSON.parse(localStorage.getItem('fm_orders') || '[]');
      localOrders.push({
        id,
        items: items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: getDiscountedPrice(i.product.price, i.product.discount),
          image: i.product.image,
        })),
        total: getTotal(),
        shipping,
        payment: 'cod',
        status: 'pending',
        date: new Date().toISOString(),
      });
      localStorage.setItem('fm_orders', JSON.stringify(localOrders));

      clearCart();
      setStep('success');
    }, 2000);
  };

  // ─── Processing Screen ──────────────────────────────────────────────────
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F5E9] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 size={32} className="text-[#1B4332] animate-spin" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Memproses Pesanan...</h2>
          <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // ─── Success Screen ─────────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check size={36} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
          <p className="text-sm text-gray-500 mb-2">Terima kasih atas pesanan Anda</p>
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Nomor Pesanan</p>
            <p className="text-lg font-bold text-[#1B4332]">#{orderId}</p>
            <p className="text-xs text-gray-400 mt-2">
              Konfirmasi pesanan telah dikirim ke email Anda
            </p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-[#1B4332] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#2D6A4F] transition"
            >
              Lihat Pesanan Saya
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-[#1B4332] py-3 rounded-xl font-semibold text-sm border border-[#1B4332] hover:bg-[#E8F5E9] transition"
            >
              Kembali Belanja
            </button>
          </div>
        </div>
        <div className="h-20 md:hidden" />
      </div>
    );
  }

  // ─── Main Checkout Form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { key: 'shipping', label: 'Pengiriman', icon: MapPin },
            { key: 'payment', label: 'Pembayaran', icon: CreditCard },
          ].map((s, i) => (
            <React.Fragment key={s.key}>
              {i > 0 && (
                <div className={`flex-1 h-0.5 ${step === 'payment' ? 'bg-[#1B4332]' : 'bg-gray-200'}`} />
              )}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  step === s.key
                    ? 'bg-[#1B4332] text-white'
                    : step === 'payment' && s.key === 'shipping'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <s.icon size={14} />
                {s.label}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          {/* Form Column */}
          <div className="md:col-span-2">
            {/* ─── Shipping Step ──────────────────────────────────────── */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-[#1B4332]" /> Alamat Pengiriman
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Nama Penerima *</label>
                    <input
                      type="text"
                      value={shipping.name}
                      onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                      placeholder="Masukkan nama lengkap"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      placeholder="email@contoh.com (untuk konfirmasi pesanan)"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Nomor HP *</label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      placeholder="08xxxxxxxxxx"
                      required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Alamat Lengkap *</label>
                    <textarea
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="Masukkan alamat lengkap (kamar/asrama, gedung, dll)"
                      required
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Catatan (opsional)</label>
                    <input
                      type="text"
                      value={shipping.notes}
                      onChange={(e) => setShipping({ ...shipping, notes: e.target.value })}
                      placeholder="Contoh: Titip di depan kamar"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#1B4332] focus:ring-1 focus:ring-[#1B4332] transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#1B4332] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#2D6A4F] transition"
                  >
                    Lanjut ke Pembayaran
                  </button>
                </div>
              </form>
            )}

            {/* ─── Payment Step ───────────────────────────────────────── */}
            {step === 'payment' && (
              <div className="space-y-4">
                {/* Shipping summary */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin size={14} className="text-[#1B4332]" /> Alamat Pengiriman
                    </h3>
                    <button onClick={() => setStep('shipping')} className="text-xs text-[#1B4332] font-medium">
                      Ubah
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{shipping.name}</p>
                  <p className="text-xs text-gray-500">{shipping.phone}</p>
                  {shipping.email && <p className="text-xs text-gray-500">{shipping.email}</p>}
                  <p className="text-xs text-gray-500 mt-1">{shipping.address}</p>
                </div>

                {/* Payment method selector */}
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-[#1B4332]" /> Metode Pembayaran
                  </h2>
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={() => setUseStripePayment(true)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                        useStripePayment ? 'border-[#1B4332] bg-[#E8F5E9]' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          useStripePayment ? 'border-[#1B4332]' : 'border-gray-300'
                        }`}
                      >
                        {useStripePayment && <div className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />}
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-sm font-semibold text-gray-800">Kartu Kredit / Debit</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard, dan lainnya</p>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-[8px] font-bold flex items-center justify-center">VISA</div>
                        <div className="w-8 h-5 bg-red-500 rounded text-white text-[8px] font-bold flex items-center justify-center">MC</div>
                      </div>
                    </button>
                    <button
                      onClick={() => setUseStripePayment(false)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition ${
                        !useStripePayment ? 'border-[#1B4332] bg-[#E8F5E9]' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          !useStripePayment ? 'border-[#1B4332]' : 'border-gray-300'
                        }`}
                      >
                        {!useStripePayment && <div className="w-2.5 h-2.5 rounded-full bg-[#1B4332]" />}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-800">Bayar di Tempat (COD)</p>
                        <p className="text-xs text-gray-500">Bayar saat barang diterima</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Stripe Payment Form */}
                {useStripePayment && (
                  <>
                    {!stripePromise ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle size={20} className="text-yellow-600" />
                          <h3 className="font-semibold text-yellow-800 text-sm">Pembayaran Online Sedang Disiapkan</h3>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Sistem pembayaran kartu kredit/debit sedang dalam proses konfigurasi. 
                          Silakan gunakan metode Bayar di Tempat (COD) untuk saat ini.
                        </p>
                      </div>
                    ) : paymentError ? (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle size={20} className="text-red-500" />
                          <h3 className="font-semibold text-red-800 text-sm">Gagal Memuat Pembayaran</h3>
                        </div>
                        <p className="text-sm text-red-600">{paymentError}</p>
                        <button
                          onClick={createPaymentIntent}
                          className="mt-3 text-sm font-semibold text-red-700 underline"
                        >
                          Coba Lagi
                        </button>
                      </div>
                    ) : clientSecret ? (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          clientSecret,
                          appearance: {
                            theme: 'stripe',
                            variables: {
                              colorPrimary: '#1B4332',
                              borderRadius: '12px',
                              fontFamily: 'Inter, system-ui, sans-serif',
                            },
                          },
                        }}
                      >
                        <StripePaymentForm onSuccess={handleStripePaymentSuccess} total={getTotal()} />
                      </Elements>
                    ) : (
                      <div className="bg-white rounded-2xl p-8 shadow-sm flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 size={24} className="text-[#1B4332] animate-spin mx-auto mb-2" />
                          <p className="text-sm text-gray-500">Memuat form pembayaran...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* COD Payment Button */}
                {!useStripePayment && (
                  <button
                    onClick={handleSimulatedPayment}
                    className="w-full bg-[#1B4332] text-white py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#2D6A4F] active:scale-[0.98] transition-all shadow-lg shadow-[#1B4332]/20"
                  >
                    Pesan Sekarang (COD) — {formatRupiah(getTotal())}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ─── Order Summary Sidebar ─────────────────────────────────── */}
          <div className="mt-4 md:mt-0">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag size={16} className="text-[#1B4332]" /> Ringkasan Pesanan
              </h2>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => {
                  const price = getDiscountedPrice(item.product.price, item.product.discount);
                  return (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400">
                          {item.quantity}x {formatRupiah(price)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-800">{formatRupiah(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatRupiah(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ongkir</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-[#1B4332] pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatRupiah(getTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
