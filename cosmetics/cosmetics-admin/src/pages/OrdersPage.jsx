import { useEffect, useState } from "react";
import { getAdminOrders } from "../services/orderService";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="py-2 pr-4">Order #</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Items</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-none align-top">
                  <td className="py-2 pr-4 text-xs text-gray-500">
                    #{o.id}
                  </td>
                  <td className="py-2 pr-4 text-xs text-gray-700">
                    <div className="font-medium text-gray-800">
                      {o.User?.name || "N/A"}
                    </div>
                    <div className="text-gray-500">{o.User?.email}</div>
                  </td>
                  <td className="py-2 pr-4 text-xs text-gray-700">
                    <ul className="space-y-1">
                      {o.OrderItems?.map((item) => (
                        <li key={item.id}>
                          {item.Product?.name} x {item.quantity} – ₹
                          {item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 pr-4 text-xs text-gray-800">
                    ₹{o.total}
                  </td>
                  <td className="py-2 pr-4 text-xs">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        o.status === "pending"
                          ? "bg-yellow-50 text-yellow-700"
                          : o.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs text-gray-500">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 text-center text-xs text-gray-400"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
