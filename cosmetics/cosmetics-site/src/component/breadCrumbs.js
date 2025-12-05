'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="hover:text-teal-600 transition">
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} />
          {item.href ? (
            <Link href={item.href} className="hover:text-teal-600 transition">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-gray-800">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}