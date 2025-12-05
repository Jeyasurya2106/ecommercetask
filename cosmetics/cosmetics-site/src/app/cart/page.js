'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCart, updateQuantity, removeFromCart, getCartTotal, clearCart } from '@/lib/cartStore';
import { createOrder, getUser } from '@/lib/api';
import { ShoppingCart } from 'lucide-react';
import CartItem from '@/component/cartItem';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setCart(getCart());
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
    setCart(getCart());
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemove = (productId) => {
    if (confirm('Are you sure you want to remove this item?')) {
      removeFromCart(productId);
      setCart(getCart());
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Check if user is logged in
    const user = getUser();
    if (!user) {
      // Redirect to login with return URL
      router.push('/login?redirect=/cart');
      return;
    }

    if (!shippingAddress.trim()) {
      alert('Please enter your shipping address');
      return;
    }

    setLoading(true);

    // Prepare order data according to backend API format
    const orderData = {
      shipping_address: shippingAddress,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const order = await createOrder(orderData);
      clearCart();
      setCart([]);
      window.dispatchEvent(new Event('cartUpdated'));
      alert('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal(cart);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/products"
            className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemove}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="inline-block mt-6 text-teal-600 hover:text-teal-700 font-semibold"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-2xl font-bold">
                  <span>Total:</span>
                  <span className="text-teal-600">₹{total}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Shipping Address *
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your complete shipping address..."
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 resize-none"
                  required
                />
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span className="text-green-600">🔒</span>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}