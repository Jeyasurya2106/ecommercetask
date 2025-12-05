import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { getProducts } from "../services/productService";
import { getAdminOrders } from "../services/orderService";

export default function DashboardPage() {
  const [stats, setStats] = useState({ categories: 0, products: 0, orders: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [cats, prods, orders] = await Promise.all([
          getCategories(),
          getProducts(),
          getAdminOrders(),
        ]);
        setStats({
          categories: cats.length,
          products: prods.length,
          orders: orders.length,
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: "Categories", value: stats.categories, icon: "🧴" },
    { label: "Products", value: stats.products, icon: "🛍️" },
    { label: "Orders", value: stats.orders, icon: "📦" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Overview</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-800">{c.value}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-lg">
              {c.icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
