'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCategories, fetchProducts } from '@/lib/api';
import Breadcrumb from '@/component/breadCrumbs';
import ProductCard from '@/component/productCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categoryId, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const cats = await fetchCategories();
      setCategories(cats);

      if (categoryId) {
        const category = cats.find(c => c.id === parseInt(categoryId));
        setSelectedCategory(category);
      } else {
        setSelectedCategory(null);
      }

      let prods = await fetchProducts(categoryId);

      // Filter by search query
      if (searchQuery) {
        prods = prods.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      setProducts(prods);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    window.history.pushState({}, '', `/products?category=${category.id}`);
    loadData();
  };

  const handleSort = (value) => {
    setSortBy(value);
    let sorted = [...products];

    switch (value) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setProducts(sorted);
  };

  const breadcrumbItems = [];
  if (selectedCategory) {
    breadcrumbItems.push({ label: selectedCategory.name, href: null });
  } else if (searchQuery) {
    breadcrumbItems.push({ label: `Search: "${searchQuery}"`, href: null });
  } else {
    breadcrumbItems.push({ label: 'All Products', href: null });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  window.history.pushState({}, '', '/products');
                  loadData();
                }}
                className={`block w-full text-left px-4 py-2 rounded transition ${
                  !selectedCategory ? 'bg-teal-100 text-teal-700 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`block w-full text-left px-4 py-2 rounded transition ${
                    selectedCategory?.id === cat.id
                      ? 'bg-teal-100 text-teal-700 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {selectedCategory
                ? selectedCategory.name
                : searchQuery
                ? `Search: "${searchQuery}"`
                : 'All Products'}
            </h1>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  window.history.pushState({}, '', '/products');
                  loadData();
                }}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                View All Products
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Showing {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}