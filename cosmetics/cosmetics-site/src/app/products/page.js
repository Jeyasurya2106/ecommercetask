'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCategories, fetchProducts, mockCategories } from '@/lib/api';
import Breadcrumb from '@/component/breadCrumbs';
import ProductCard from '@/component/productCard';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [categoryId, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    const cats = await fetchCategories();
    setCategories(cats);

    if (categoryId) {
      const category = cats.find(c => c.id === parseInt(categoryId));
      setSelectedCategory(category);
    }

    let prods = await fetchProducts(categoryId);

    // Filter by search query
    if (searchQuery) {
      prods = prods.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProducts(prods);
    setLoading(false);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    window.history.pushState({}, '', `/products?category=${category.id}`);
    loadData();
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    const filtered = products.filter(p => p.subcategory === subcategory);
    setProducts(filtered);
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
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
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
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  window.history.pushState({}, '', '/products');
                  loadData();
                }}
                className={`block w-full text-left px-4 py-2 rounded transition ${
                  !selectedCategory ? 'bg-teal-100 text-teal-700' : 'hover:bg-gray-100'
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
                      ? 'bg-teal-100 text-teal-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.image} {cat.name}
                </button>
              ))}
            </div>

            {selectedCategory && selectedCategory.subcategories && (
              <>
                <h3 className="font-bold text-lg mt-6 mb-4">Subcategories</h3>
                <div className="space-y-2">
                  {selectedCategory.subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleSubcategoryClick(sub)}
                      className={`block w-full text-left px-4 py-2 rounded transition ${
                        selectedSubcategory === sub
                          ? 'bg-teal-100 text-teal-700'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">
              {selectedCategory
                ? selectedCategory.name
                : searchQuery
                ? `Search: "${searchQuery}"`
                : 'All Products'}
            </h1>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rating</option>
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
                  setSelectedSubcategory(null);
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
              <p className="text-gray-600 mb-4">{products.length} products found</p>
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