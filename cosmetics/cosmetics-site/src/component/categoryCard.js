'use client';

import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/products?category=${category.id}`}>
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition text-center group cursor-pointer">
        <div className="text-6xl mb-4">{category.image}</div>
        <h3 className="text-xl font-semibold group-hover:text-teal-600 transition">
          {category.name}
        </h3>
        {category.subcategories && (
          <p className="text-sm text-gray-500 mt-2">
            {category.subcategories.length} subcategories
          </p>
        )}
      </div>
    </Link>
  );
}