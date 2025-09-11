import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaChevronUp,
  FaChevronDown,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaFileAlt,
  FaUserShield,
  FaCubes,
  FaTasks,
  FaUserCog,
  FaUsersCog,
  FaSignOutAlt,
} from "react-icons/fa";

const links = [
  { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/products", label: "Products List", icon: <FaBoxOpen /> },
  { to: "/admin/staff", label: "Staff List", icon: <FaUserTie /> },
  { to: "/admin/customers", label: "Customer Data", icon: <FaUsers /> },
  { to: "/admin/meetings/add", label: "Meeting Details", icon: <FaCalendarAlt /> },
  { to: "/admin/followup", label: "Follow Up", icon: <FaTasks /> },
  { to: "/admin/calendar", label: "Calendar", icon: <FaCalendarAlt /> },
  { to: "/admin/report", label: "Report", icon: <FaFileAlt /> },
  {
    label: "Security",
    adminOnly: true, // 
    icon: <FaUserShield />,
    children: [
      { to: "/admin/groups", label: "Group Management", icon: <FaUsersCog /> },
      { to: "/admin/users", label: "Users", icon: <FaUserCog /> },
      { to: "/admin/modules", label: "Modules", icon: <FaCubes /> },
      { to: "/admin/modules-functionalities", label: "Modules Functionalities", icon: <FaTasks /> },
      { to: "/admin/access-rights", label: "Access Control", icon: <FaUserShield /> },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);


  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const isAdmin = userInfo?.isAdmin === true;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="bg-white shadow min-h-screen w-16 sm:w-20 md:w-60 flex flex-col py-8 px-2 sm:px-4 justify-between transition-all duration-300">
      {/* Logo / Title */}
      <div>
        <div className="flex items-center justify-center mb-12 space-x-2 md:space-x-4">
          <div className="relative">
            <svg
              className="w-10 h-10 text-newPrimary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 
                01-.502 1.21l-2.257 1.13a11.042 11.042 0 
                005.516 5.516l1.13-2.257a1 1 0 
                011.21-.502l4.493 1.498a1 1 0 
                01.684.949V19a2 2 0 01-2 2h-1C9.716 
                21 3 14.284 3 6V5z"
              />
            </svg>
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-newPrimary to-primaryDark bg-clip-text text-transparent">
            Call Logs Dashboard
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {links
            .filter((link) => !link.adminOnly || isAdmin) // 🔹 filter out admin-only items
            .map((link, idx) =>
              link.children ? (
                <div key={idx}>
                  {/* Parent */}
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === idx ? null : idx)
                    }
                    className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-secondary/30 w-full text-left"
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span className="hidden md:block">{link.label}</span>
                    {openDropdown === idx ? (
                      <FaChevronUp className="ml-auto w-4 h-4 hidden sm:block" />
                    ) : (
                      <FaChevronDown className="ml-auto w-4 h-4 hidden sm:block" />
                    )}
                  </button>

                  {/* Sub-links */}
                  {openDropdown === idx && (
                    <div className="ml-6 flex flex-col gap-1 mt-1">
                      {link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${isActive
                              ? "bg-secondary text-white"
                              : "text-gray-600 hover:bg-secondary/30"
                            }`
                          }
                        >
                          <span className="text-base">{child.icon}</span>
                          <span className="hidden md:block">{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${isActive
                      ? "bg-secondary text-white"
                      : "text-gray-700 hover:bg-secondary/30"
                    }`
                  }
                  end={link.to === "/admin"}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="hidden md:block">{link.label}</span>
                </NavLink>
              )
            )}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-600 hover:text-white font-semibold transition"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="hidden md:block">Logout</span>
      </button>
    </aside>
  );
};

export default AdminSidebar;
