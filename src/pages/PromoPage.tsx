import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { getPromoProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function PromoPage() {
  const promoProducts = getPromoProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Promo Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-3">
            <Tag size={14} />
            <span className="text-xs font-semibold">PROMO SPESIAL</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Promo Hari Ini</h1>
          <p className="text-white/80 text-sm">Dapatkan diskon menarik untuk produk pilihan</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">{promoProducts.length} produk promo</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {promoProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
