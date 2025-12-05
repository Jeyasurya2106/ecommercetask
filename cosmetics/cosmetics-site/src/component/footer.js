'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🌿 NaturalCare</h3>
            <p className="text-gray-400 text-sm">
              100% Natural • Toxin-Free • Cruelty-Free • Made Safe Certified
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/products" className="hover:text-white">All Products</Link></li>
              <li><Link href="/orders" className="hover:text-white">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-white">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products?category=1" className="hover:text-white">Face Care</Link></li>
              <li><Link href="/products?category=2" className="hover:text-white">Hair Care</Link></li>
              <li><Link href="/products?category=3" className="hover:text-white">Body Care</Link></li>
              <li><Link href="/products?category=4" className="hover:text-white">Baby Care</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: support@naturalcare.com</li>
              <li>Phone: +91 1800-123-4567</li>
              <li>Mon-Sat: 9:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} NaturalCare. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms & Conditions</Link>
            <Link href="#" className="hover:text-white">Return Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}