// src/lib/cartStore.js
// Cart State Management

export const getCart = () => {
  if (typeof window === 'undefined') return [];
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  let newCart;
  if (existingItem) {
    newCart = cart.map(item =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    newCart = [...cart, { ...product, quantity: 1 }];
  }
  
  saveCart(newCart);
  return newCart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const newCart = cart.filter(item => item.id !== productId);
  saveCart(newCart);
  return newCart;
};

export const updateQuantity = (productId, quantity) => {
  const cart = getCart();
  
  if (quantity <= 0) {
    return removeFromCart(productId);
  }
  
  const newCart = cart.map(item =>
    item.id === productId
      ? { ...item, quantity }
      : item
  );
  
  saveCart(newCart);
  return newCart;
};

export const clearCart = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('cart');
  return [];
};

export const getCartTotal = (cart = null) => {
  const items = cart || getCart();
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartCount = (cart = null) => {
  const items = cart || getCart();
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Orders Management
export const saveOrder = (order) => {
  if (typeof window === 'undefined') return;
  const orders = localStorage.getItem('orders');
  const ordersList = orders ? JSON.parse(orders) : [];
  ordersList.push(order);
  localStorage.setItem('orders', JSON.stringify(ordersList));
};

export const getOrders = () => {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};