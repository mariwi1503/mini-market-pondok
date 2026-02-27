import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Tag, Truck, Clock, Shield, ArrowRight, Star } from 'lucide-react';
import { products, categories, getPromoProducts, formatRupiah, getDiscountedPrice } from '@/data/products';
import { articles } from '@/data/articles';
import ProductCard from '@/components/ProductCard';

const HERO_IMAGE = 'https://d64gsuwffb70l.cloudfront.net/69a0fc2ec1e9be6446678960_1772158272989_31222225.jpg';

const banners = [
  { id: 1, title: 'Promo Ramadhan', subtitle: 'Diskon hingga 25% untuk semua kebutuhan', color: 'from-[#1B4332] to-[#2D6A4F]' },
  { id: 2, title: 'Gratis Ongkir', subtitle: 'Untuk semua pesanan tanpa minimum', color: 'from-[#D4AF37] to-[#B8941F]' },
  { id: 3, title: 'Belanja Hemat', subtitle: 'Harga spesial untuk santri', color: 'from-[#4A8B5C] to-[#2D6A4F]' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBanner, setActiveBanner] = useState(0);
  const promoProducts = getPromoProducts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Mini Market" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/80 via-[#1B4332]/60 to-[#1B4332]/90" />
        </div>
        <div className="relative px-4 pt-4 pb-8 md:pt-8 md:pb-16 max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-white/90 text-xs font-medium">Buka Setiap Hari 06:00 - 22:00</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
              Mini Market <span className="text-[#D4AF37]">Faizal Baqarah</span>
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-md mx-auto">
              Belanja kebutuhan harian dengan mudah dan berkah. Gratis ongkir untuk semua pesanan!
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari produk yang Anda butuhkan..."
                className="w-full bg-white rounded-2xl px-5 py-3.5 pl-12 text-sm text-gray-800 placeholder-gray-400 shadow-lg outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#2D6A4F] transition">
                Cari
              </button>
            </div>
          </form>

          {/* Feature badges */}
          <div className="flex items-center justify-center gap-3 md:gap-6 flex-wrap">
            {[
              { icon: Truck, text: 'Gratis Ongkir' },
              { icon: Clock, text: 'Pesan Cepat' },
              { icon: Shield, text: 'Produk Halal' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
                <f.icon size={14} className="text-[#D4AF37]" />
                <span className="text-white/90 text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banners */}
      <div className="px-4 -mt-4 mb-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className={`bg-gradient-to-r ${banners[activeBanner].color} p-5 md:p-8 text-white transition-all duration-500`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Tag size={16} className="text-[#D4AF37]" />
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide">Promo Spesial</span>
            </div>
            <h2 className="text-lg md:text-2xl font-bold mb-1">{banners[activeBanner].title}</h2>
            <p className="text-white/80 text-sm mb-3">{banners[activeBanner].subtitle}</p>
            <Link to="/promo" className="inline-flex items-center gap-1 bg-white text-[#1B4332] px-4 py-2 rounded-full text-xs font-bold hover:bg-[#D4AF37] hover:text-white transition">
              Lihat Promo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`w-2 h-2 rounded-full transition ${i === activeBanner ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="px-4 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Kategori</h2>
          <Link to="/categories" className="text-[#1B4332] text-sm font-semibold flex items-center gap-1 hover:underline">
            Semua <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.handle}`}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:shadow-md transition-all duration-200 group"
              style={{ backgroundColor: cat.color }}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-xs font-semibold text-gray-700 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Promo Products */}
      <section className="px-4 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-red-500 rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">Promo Hari Ini</h2>
          </div>
          <Link to="/promo" className="text-[#1B4332] text-sm font-semibold flex items-center gap-1 hover:underline">
            Lihat Semua <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-4 md:overflow-visible md:mx-0 md:px-0">
          {promoProducts.map(product => (
            <div key={product.id} className="min-w-[160px] md:min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section className="px-4 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#1B4332] rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">Produk Populer</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {products.slice(0, 10).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 bg-[#1B4332] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#2D6A4F] transition"
          >
            Lihat Semua Produk <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Articles */}
      <section className="px-4 mb-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-[#D4AF37] rounded-full" />
            <h2 className="text-lg font-bold text-gray-800">Artikel Terbaru</h2>
          </div>
          <Link to="/articles" className="text-[#1B4332] text-sm font-semibold flex items-center gap-1 hover:underline">
            Semua <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:mx-0 md:px-0">
          {articles.slice(0, 3).map(article => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="min-w-[280px] md:min-w-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="aspect-video overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold text-[#1B4332] bg-[#E8F5E9] px-2 py-0.5 rounded-full">{article.category}</span>
                  <span className="text-[10px] text-gray-400">{article.readTime}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-[#1B4332] transition">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="px-4 mb-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] rounded-2xl p-6 md:p-10 text-white text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Tentang Kami</h2>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-4">
            Mini Market Faizal Baqarah adalah toko kelontong modern yang berada di lingkungan Pondok Pesantren Faizal Baqarah. 
            Kami menyediakan berbagai kebutuhan harian dengan harga terjangkau dan produk yang terjamin halal.
          </p>
          <a
            href="https://madrasahfaizalbaqarah.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#1B4332] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-white transition"
          >
            Kunjungi Website Pondok <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B4332] text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold text-[#1B4332]">
                  FB
                </div>
                <div>
                  <h3 className="font-bold">Mini Market Faizal Baqarah</h3>
                  <p className="text-xs text-white/60">Belanja Mudah, Berkah Selalu</p>
                </div>
              </div>
              <p className="text-sm text-white/70 mb-4 max-w-sm">
                Toko kelontong modern di lingkungan Pondok Pesantren Faizal Baqarah. 
                Menyediakan kebutuhan harian santri dan masyarakat sekitar.
              </p>
              <div className="flex gap-3">
                {['Facebook', 'Instagram', 'WhatsApp'].map(social => (
                  <button key={social} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-[#D4AF37] hover:text-[#1B4332] transition">
                    {social.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#D4AF37]">Kategori</h4>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.handle}`} className="text-sm text-white/70 hover:text-white transition">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-[#D4AF37]">Informasi</h4>
              <ul className="space-y-2">
                {['Tentang Kami', 'Cara Belanja', 'Kebijakan Privasi', 'Syarat & Ketentuan', 'Hubungi Kami'].map(item => (
                  <li key={item}>
                    <button className="text-sm text-white/70 hover:text-white transition">{item}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center">
            <p className="text-xs text-white/50">
              &copy; 2026 Mini Market Faizal Baqarah. Pondok Pesantren Faizal Baqarah.
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom spacing for mobile nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
