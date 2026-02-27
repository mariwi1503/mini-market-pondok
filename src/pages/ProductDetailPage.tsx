import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Heart, Share2, ChevronLeft, Check, Star } from 'lucide-react';
import { getProductByHandle, formatRupiah, getDiscountedPrice, getProductsByCategory, Product } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart, items, updateQuantity, removeFromCart } = useCart();
  const [product, setProduct] = useState<Product | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (handle) {
      const p = getProductByHandle(handle);
      setProduct(p);
      setQuantity(1);
      setAddedToCart(false);
      window.scrollTo(0, 0);
    }
  }, [handle]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Produk tidak ditemukan</p>
          <Link to="/" className="text-[#1B4332] font-semibold">Kembali ke Beranda</Link>
        </div>
      </div>
    );
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const inCart = isInCart(product.id);
  const cartItem = items.find(i => i.product.id === product.id);
  const relatedProducts = getProductsByCategory(product.categoryId).filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="sticky top-14 md:top-16 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 hover:text-[#1B4332] transition">
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Kembali</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked(!liked)} className={`p-2 rounded-full transition ${liked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}>
              <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 transition">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="md:grid md:grid-cols-2 md:gap-8 md:p-6">
          {/* Image */}
          <div className="aspect-square md:rounded-2xl overflow-hidden bg-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="px-4 py-5 md:py-0">
            {/* Category */}
            <Link to={`/category/${product.categoryId}`} className="text-xs font-semibold text-[#1B4332] bg-[#E8F5E9] px-3 py-1 rounded-full inline-block mb-3">
              {product.category}
            </Link>

            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} className={i <= 4 ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300'} />
                ))}
              </div>
              <span className="text-xs text-gray-500">4.0 (24 ulasan)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-[#1B4332]">{formatRupiah(discountedPrice)}</span>
              {product.discount && (
                <>
                  <span className="text-base text-gray-400 line-through">{formatRupiah(product.price)}</span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{product.discount}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'}`} />
              <span className="text-sm text-gray-600">
                {product.stock > 10 ? 'Stok Tersedia' : `Sisa ${product.stock} ${product.unit}`}
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Deskripsi</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Jumlah</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#1B4332] hover:bg-[#C8E6C9] transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-lg font-bold text-[#1B4332]">{formatRupiah(discountedPrice * quantity)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1B4332] text-white hover:bg-[#2D6A4F] active:scale-[0.98]'
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={18} /> Ditambahkan ke Keranjang
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Tambah ke Keranjang
                  </>
                )}
              </button>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Halal', desc: 'Terjamin' },
                { label: 'Gratis Ongkir', desc: 'Semua Pesanan' },
                { label: 'Retur', desc: 'Mudah' },
              ].map((info, i) => (
                <div key={i} className="text-center p-3 bg-white rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-[#1B4332]">{info.label}</p>
                  <p className="text-[10px] text-gray-500">{info.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="px-4 py-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Produk Serupa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
