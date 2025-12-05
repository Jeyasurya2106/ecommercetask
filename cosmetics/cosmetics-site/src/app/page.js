'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchCategories, fetchProducts } from '@/lib/api';
import CategoryCard from '@/component/categoryCard';
import ProductCard from '@/component/productCard';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await fetchCategories();
      const prods = await fetchProducts();
      setCategories(cats);
      setFeaturedProducts(prods.slice(0, 8));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-50 via-green-50 to-teal-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            Natural Beauty, Naturally
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            100% Toxin-Free | Dermatologically Tested | Made Safe Certified
          </p>
          <Link
            href="/products"
            className="inline-block bg-teal-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-teal-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-3">🌿</div>
            <h3 className="font-semibold text-lg mb-2">100% Natural</h3>
            <p className="text-gray-600 text-sm">Made with natural ingredients, no harmful chemicals</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-3">✨</div>
            <h3 className="font-semibold text-lg mb-2">Dermatologically Tested</h3>
            <p className="text-gray-600 text-sm">Clinically proven safe for all skin types</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-3">🐰</div>
            <h3 className="font-semibold text-lg mb-2">Cruelty-Free</h3>
            <p className="text-gray-600 text-sm">Never tested on animals, certified cruelty-free</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      {!loading && categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {!loading && featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Bestsellers</h2>
              <Link
                href="/products"
                className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Natural Beauty Revolution
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Get exclusive offers, new product launches, and beauty tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}