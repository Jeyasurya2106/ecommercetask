'use client';

import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group cursor-pointer border border-gray-100 transform hover:-translate-y-1">
        {category.image_url ? (
          <div className="mb-4 overflow-hidden rounded-lg">
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="text-6xl mb-4">🛍️</div>
        )}
        <h3 className="text-xl font-semibold group-hover:text-teal-600 transition">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}