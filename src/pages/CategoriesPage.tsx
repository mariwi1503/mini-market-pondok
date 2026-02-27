import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categories, getProductsByCategory, formatRupiah, getDiscountedPrice } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Semua Kategori</h1>
        <p className="text-sm text-gray-500 mb-6">Temukan produk berdasarkan kategori</p>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
          {categories.map(cat => {
            const count = getProductsByCategory(cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.handle}`}
                className="flex items-center gap-3 p-4 rounded-2xl hover:shadow-md transition-all duration-200 group"
                style={{ backgroundColor: cat.color }}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{count} produk</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 ml-auto" />
              </Link>
            );
          })}
        </div>

        {/* Products by Category */}
        {categories.map(cat => {
          const catProducts = getProductsByCategory(cat.id).slice(0, 4);
          if (catProducts.length === 0) return null;
          return (
            <section key={cat.id} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.name}
                </h2>
                <Link to={`/category/${cat.handle}`} className="text-[#1B4332] text-xs font-semibold flex items-center gap-1 hover:underline">
                  Lihat Semua <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {catProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
