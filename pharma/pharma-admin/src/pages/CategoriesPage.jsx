import { useEffect, useState } from "react";
import { getCategories, createCategory } from "../services/categoryService";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    setLoading(true);
    try {
      await createCategory({ name, description });
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Form */}
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-xl shadow-sm p-4 space-y-3 md:col-span-1"
        >
          <h3 className="text-sm font-semibold text-gray-700">Add Category</h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Skin Care"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Serums, moisturizers, etc."
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
        <div className="bg-white rounded-xl shadow-sm p-4 md:col-span-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Existing Categories
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Slug</th>
                  <th className="py-2 pr-4 hidden md:table-cell">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id} className="border-b last:border-none">
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      #{c.id}
                    </td>
                    <td className="py-2 pr-4 font-medium text-gray-800">
                      {c.name}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-500">
                      {c.slug}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-500 hidden md:table-cell">
                      {c.description || "-"}
                    </td>
                  </tr>
                ))}
                {!categories.length && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-xs text-gray-400"
                    >
                      No categories yet.
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
