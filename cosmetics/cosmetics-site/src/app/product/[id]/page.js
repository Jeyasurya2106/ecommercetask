'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Share2 } from 'lucide-react';
import { fetchProductById } from '@/lib/api';
import Breadcrumb from '@/component/breadCrumbs';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  const loadProduct = async () => {
    setLoading(true);
    const data = await fetchProductById(params.id);
    setProduct(data);
    setLoading(false);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => router.push('/products')}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product.name, href: null }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl h-[500px] flex items-center justify-center sticky top-24">
          <span className="text-9xl">{product.image}</span>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-lg font-medium">{product.rating}</span>
            <span className="text-gray-500">({product.reviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold text-teal-600 mb-6">
            ₹{product.price}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-3">Key Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-sm">100% Natural & Toxin-Free</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-sm">Dermatologically Tested</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-sm">Made Safe Certified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-sm">Cruelty-Free & Vegan</span>
              </li>
            </ul>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="px-6 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={handleAddToCart}
              className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 font-bold text-lg transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full border-2 border-teal-600 text-teal-600 py-4 rounded-lg hover:bg-teal-50 font-bold text-lg transition"
            >
              Buy Now
            </button>
          </div>

          {/* Additional Actions */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
              <Heart size={20} />
              <span>Add to Wishlist</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
              <Share2 size={20} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}