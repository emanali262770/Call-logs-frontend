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
  FaPhone,
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
  const [isCollapsed, setIsCollapsed] = useState(false);


  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const isAdmin = userInfo?.isAdmin === true;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg min-h-screen ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col py-6 px-2 justify-between transition-all duration-300 relative`}>
      {/* Collapse Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-1 z-10 shadow-md"
      >
        {isCollapsed ? 
          <FaChevronDown className="w-4 h-4 transform rotate-90" /> : 
          <FaChevronUp className="w-4 h-4 transform -rotate-90" />
        }
      </button>

      {/* Logo / Title */}
      <div>
        <div className="flex items-center justify-center mb-8 px-2">
          <div className="relative flex items-center justify-center p-2 bg-newPrimary/20 rounded-lg">
            <div className="relative p-2 bg-newPrimary rounded-lg">
              <FaPhone className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
            </div>
            {!isCollapsed && (
              <h1 className="ml-3 text-lg font-bold text-white truncate">
                Call Logs Dashboard
              </h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {links.map((link, idx) =>
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
                          `flex items-center gap-2 px-3 py-1 rounded-md text-sm transition ${
                            isActive
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
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                    isActive
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
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-900/30 hover:text-red-400 font-medium transition-all duration-200 group mt-4"
      >
        <FaSignOutAlt className="text-lg group-hover:text-red-400 transition-colors" />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default AdminSidebar;