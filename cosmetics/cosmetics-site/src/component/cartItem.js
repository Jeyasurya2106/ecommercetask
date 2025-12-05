'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b hover:bg-gray-50 transition">
      {/* Product Image */}
      <div className="bg-gradient-to-br from-teal-50 to-green-50 w-24 h-24 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
        {item.image}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{item.name}</h3>
        <p className="text-teal-600 font-bold">₹{item.price}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-2 border rounded hover:bg-gray-100 transition"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="font-semibold w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-2 border rounded hover:bg-gray-100 transition"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Total Price */}
      <div className="font-bold w-24 text-right">
        ₹{item.price * item.quantity}
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-red-500 hover:bg-red-50 rounded transition"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}