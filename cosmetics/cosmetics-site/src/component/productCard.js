'use client';

import Link from 'next/link';
import { addToCart } from '@/lib/cartStore';

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
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-teal-50 to-green-50 h-64 flex items-center justify-center text-8xl">
          {product.image}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 line-clamp-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="text-xl font-bold text-teal-600 mb-3 mt-auto">
            ₹{product.price}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 font-semibold transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}