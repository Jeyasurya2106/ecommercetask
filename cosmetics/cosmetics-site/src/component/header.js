'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Search, Heart, Menu, X, LogOut } from 'lucide-react';
import { getCartCount } from '@/lib/cartStore';
import { fetchCategories, getUser, logout } from '@/lib/api';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    updateCartCount();
    loadCategories();
    loadUser();
    
    // Update cart count when storage changes
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('userLoggedIn', loadUser);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('userLoggedIn', loadUser);
    };
  }, []);

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const loadUser = () => {
    const userData = getUser();
    setUser(userData);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-teal-600 hover:text-teal-700 flex-shrink-0">
            🌿 JS COSMETICS
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-teal-500 transition"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 hover:bg-teal-50 rounded-full hidden md:block transition">
              <Heart size={24} className="text-gray-700" />
            </button>
            
            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded-full transition"
                >
                  <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 transition">
                      My Orders
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600 flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition font-semibold">
                <User size={20} />
                Login
              </Link>
            )}
            
            <Link href="/cart" className="p-2 hover:bg-teal-50 rounded-full relative transition">
              <ShoppingCart size={24} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 hover:bg-teal-50 rounded-full transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-teal-500"
              />
            </form>
            
            {!user && (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 mb-4 font-semibold"
              >
                Login / Register
              </Link>
            )}
            
            <nav className="space-y-2">
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 hover:bg-teal-50 rounded transition"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Category Nav */}
      <nav className="hidden md:block bg-teal-50 border-t border-teal-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="text-gray-700 hover:text-teal-600 font-medium transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}