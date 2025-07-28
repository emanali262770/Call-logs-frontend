import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/users", label: "Products List" },
  { to: "/admin/products", label: "Staff List" },
  { to: "/admin/transactions", label: "Customer Data" },
  { to: "/admin/promotion", label: "Meeting Details" },
  { to: "/admin/category", label: "Follow Up" },
  { to: "/admin/category", label: "Report" },
  { to: "/admin/category", label: "Calendar" },
  { to: "/admin/category", label: "Settings" },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage or token
    localStorage.removeItem("user");
    // Redirect to login
    navigate("/login");
  };

  return (
    <aside className="bg-white shadow h-screen w-56 flex flex-col py-8 px-4 justify-between">
      <div>
        <div className="text-2xl font-bold text-newPrimary mb-10 text-center">Call Logs Dashboard</div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-secondary text-white"
                    : "text-gray-700 hover:bg-secondary/30"
                }`
              }
              end={link.to === "/admin"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="hover:bg-red-600 flex   items-start pl-4 text-gray-700 hover:text-white font-semibold py-2 rounded transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
