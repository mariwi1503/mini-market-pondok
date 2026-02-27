import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { categories, products, getProductsByCategory, formatRupiah } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function CategoryPage() {
  const { handle } = useParams<{ handle: string }>();
  const [sortBy, setSortBy] = useState('default');
  const [showSort, setShowSort] = useState(false);

  const category = categories.find(c => c.handle === handle);
  const categoryProducts = handle ? getProductsByCategory(category?.id || '') : products;

  const sortedProducts = useMemo(() => {
    const sorted = [...categoryProducts];
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, [categoryProducts, sortBy]);

  const sortOptions = [
    { value: 'default', label: 'Urutkan' },
    { value: 'price-asc', label: 'Harga Terendah' },
    { value: 'price-desc', label: 'Harga Tertinggi' },
    { value: 'name', label: 'Nama A-Z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-[#1B4332]">Beranda</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{category?.name || 'Semua Produk'}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{category?.name || 'Semua Produk'}</h1>
            <p className="text-sm text-gray-500">{sortedProducts.length} produk</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition"
            >
              <SlidersHorizontal size={14} />
              {sortOptions.find(o => o.value === sortBy)?.label}
              <ChevronDown size={14} />
            </button>
            {showSort && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-20">
                {sortOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                      sortBy === opt.value ? 'text-[#1B4332] font-semibold bg-[#E8F5E9]' : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
          <Link
            to="/categories"
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
              !handle ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/category/${cat.handle}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
                handle === cat.handle ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.name}
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">Tidak ada produk dalam kategori ini</p>
          </div>
        )}
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}
