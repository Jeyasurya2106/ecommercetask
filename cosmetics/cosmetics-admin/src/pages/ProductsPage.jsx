import { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import { getProducts, createProduct } from "../services/productService";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
    setCategories(cats);
    setProducts(prods);
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setLoading(true);
    try {
      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock || 0),
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      });
      setForm({
        name: "",
        price: "",
        stock: "",
        categoryId: "",
        description: "",
      });
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Products</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm p-4 space-y-3 lg:col-span-1"
        >
          <h3 className="text-sm font-semibold text-gray-700">Add Product</h3>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Aloe Gel"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Category
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Short description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 text-white text-sm font-semibold py-2 hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

        {/* List */}
        <div className="bg-white rounded-xl shadow-sm p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Existing Products
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b last:border-none">
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      #{p.id}
                    </td>
                    <td className="py-2 pr-4 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      {p.Category?.name || "-"}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-700">
                      ₹{p.price}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-700">
                      {p.stock}
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 text-center text-xs text-gray-400"
                    >
                      No products yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
