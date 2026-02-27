import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import { searchProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Link to="/" className="p-2 rounded-full hover:bg-gray-100 transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-800">Hasil Pencarian</h1>
            <p className="text-sm text-gray-500">
              {results.length} hasil untuk "<span className="text-[#1B4332] font-medium">{query}</span>"
            </p>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-800 mb-2">Produk Tidak Ditemukan</h2>
            <p className="text-sm text-gray-500 mb-6">Coba kata kunci lain atau telusuri kategori</p>
            <Link to="/categories" className="text-[#1B4332] text-sm font-semibold hover:underline">
              Lihat Semua Kategori
            </Link>
          </div>
        )}
      </div>
      <div className="h-20 md:hidden" />
    </div>
  );
}
