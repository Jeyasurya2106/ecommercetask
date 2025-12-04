import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/authService";

export default function Layout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-indigo-600 text-white shadow"
        : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="px-6 py-4 border-b flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h1 className="font-semibold text-gray-800">Admin Panel</h1>
            <p className="text-xs text-gray-400">Cosmetics & Pharma</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavLink to="/" end className={navLinkClass}>
            <span>📊</span> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            <span>🧴</span> <span>Categories</span>
          </NavLink>
          <NavLink to="/products" className={navLinkClass}>
            <span>🛍️</span> <span>Products</span>
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            <span>📦</span> <span>Orders</span>
          </NavLink>
        </nav>

        <div className="px-4 py-4 border-t text-xs text-gray-500">
          <div className="flex items-center justify-between mb-2">
            <span>{user?.email}</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px]">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold text-gray-800">Admin Dashboard</h2>
        </header>
        <section className="flex-1 p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
