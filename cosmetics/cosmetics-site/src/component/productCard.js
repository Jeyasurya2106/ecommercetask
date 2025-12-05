'use client';

import Link from 'next/link';
import { addToCart } from '@/lib/cartStore';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    
    // Dispatch custom event to update cart count in header
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show toast notification
    alert(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col border border-gray-100">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-teal-50 to-green-50 h-64 flex items-center justify-center relative overflow-hidden">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <span className="text-8xl">🛍️</span>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Only {product.stock} left!
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 line-clamp-2 transition">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3 mt-auto">
            <span className="text-2xl font-bold text-teal-600">₹{product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-teal-600 text-white py-2.5 rounded-lg hover:bg-teal-700 font-semibold transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={18} />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}