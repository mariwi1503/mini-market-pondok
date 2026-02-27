import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, ShoppingCart, Check } from 'lucide-react';
import { Product, formatRupiah, getDiscountedPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const discountedPrice = getDiscountedPrice(product.price, product.discount);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (compact) {
    return (
      <Link to={`/product/${product.handle}`} className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition group">
        <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#1B4332] transition">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-[#1B4332]">{formatRupiah(discountedPrice)}</span>
            {product.discount && (
              <span className="text-xs text-gray-400 line-through">{formatRupiah(product.price)}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition ${
            inCart
              ? 'bg-[#1B4332] text-white'
              : 'bg-[#E8F5E9] text-[#1B4332] hover:bg-[#1B4332] hover:text-white'
          }`}
        >
          {inCart ? <Check size={14} /> : <Plus size={16} />}
        </button>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.handle}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </div>
        )}
        {product.stock <= 10 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Stok Terbatas
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#1B4332] transition">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5">/{product.unit}</p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-sm font-bold text-[#1B4332]">{formatRupiah(discountedPrice)}</span>
            {product.discount && (
              <span className="text-[11px] text-gray-400 line-through ml-1">{formatRupiah(product.price)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              inCart
                ? 'bg-[#1B4332] text-white scale-110'
                : 'bg-[#E8F5E9] text-[#1B4332] hover:bg-[#1B4332] hover:text-white active:scale-95'
            }`}
          >
            {inCart ? <Check size={14} /> : <Plus size={16} />}
          </button>
        </div>
      </div>
    </Link>
  );
}
