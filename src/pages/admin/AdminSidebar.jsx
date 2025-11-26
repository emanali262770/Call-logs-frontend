import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaDiagramSuccessor } from "react-icons/fa6";
import axios from "axios";

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
  FaSignOutAlt,FaHistory 
} from "react-icons/fa";
import { MdAssignmentTurnedIn } from "react-icons/md";

const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
// 🔹 Link definitions with permission keys
const links = [
  { to: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
  { to: "/admin/products", label: "Products List", icon: <FaBoxOpen />, key: "isProduct" },
  { to: "/admin/staff", label: "Staff List", icon: <FaUserTie />, key: "isStaff" },
  { to: "/admin/customers", label: "Customer Data", icon: <FaUsers />, key: "isCustomer" },
  { to: "/admin/assign", label: "Assign To", icon: <MdAssignmentTurnedIn />, key: "isAssign" },
  // { to: "/admin/more-product-assign", label: "More Product Assign", icon: <FaUsers /> },
  { to: "/admin/meetings/add", label: "Meeting Details", icon: <FaCalendarAlt />, key: "isMeeting" },
  { to: "/admin/meetings-tracking", label: "Meeting Calls Track", icon: <FaCalendarAlt /> , key: "isTrack"},
  { to: "/admin/followup", label: "Follow Up", icon: <FaTasks />, key: "isFollow" },
  { to: "/admin/success-client", label: "Success Client", icon: <FaDiagramSuccessor />,  },
  { to: "/admin/calendar", label: "Calendar", icon: <FaCalendarAlt />, key: "isCalendar" },
    { to: "/admin/history", label: "Activity Track", icon: <FaHistory  />, key: "isHistory" },
   ...(!userInfo.isAdmin
    ? [{ to: "/admin/settings/profile", label: "Settings", icon: <FaUsers /> }]
    : []),
  // { to: "/admin/report", label: "Report", icon: <FaFileAlt /> },

  {
    label: "Security",
    key: "isSecurity", // 🔹 controlled by backend field
    icon: <FaUserShield />,
    children: [
      { to: "/admin/groups", label: "Group Management", icon: <FaUsersCog /> },
      { to: "/admin/users", label: "Users", icon: <FaUserCog /> },
      // { to: "/admin/modules", label: "Modules", icon: <FaCubes /> },
      { to: "/admin/modules-functionalities", label: "Access Control", icon: <FaUserShield /> },
      // { to: "/admin/access-rights", label: "Access Control", icon: <FaUserShield /> },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  // 🔹 Get logged-in user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  console.log("user", userInfo);
  
  const isAdmin = userInfo?.isAdmin === true;

const handleLogout = async () => {
  try {
    const token = userInfo?.token;

    if (token) {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    // ✅ Clear local storage and redirect
    localStorage.removeItem("userInfo");
    navigate("/");

  } catch (error) {
    console.error("Logout error:", error);
    // Still remove localStorage to avoid stuck session
    localStorage.removeItem("userInfo");
    navigate("/");
  }
};

  // 🔹 Filter links based on role & permissions
const filteredLinks = links.filter((link) => {
  if (userInfo.isAdmin) return true; // admin sees everything
  if (!link.key) return true; // links without key always show
  return userInfo[link.key] === true; // normal user sees only allowed links
});



  return (
    <aside className="bg-white overflow-scroll shadow min-h-screen w-16 sm:w-20 md:w-60 flex flex-col py-8 px-2 sm:px-4 justify-between transition-all duration-300">
      {/* Logo / Title */}
      <Link to='/admin'>
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 
                01.948.684l1.498 4.493a1 1 0 
                01-.502 1.21l-2.257 1.13a11.042 
                11.042 0 005.516 5.516l1.13-2.257a1 
                1 0 011.21-.502l4.493 1.498a1 1 0 
                01.684.949V19a2 2 0 
                01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <h1 className="hidden md:block text-xl font-bold bg-gradient-to-r from-newPrimary to-primaryDark bg-clip-text text-transparent">

            Call Logs Dashboard <span>/Infinitybyte</span>

          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col  gap-2">
          {filteredLinks.map((link, idx) =>
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
                          `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
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
      </Link>

      <div className="mt-auto">
        {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-2 w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-600 hover:text-white font-semibold transition"
      >
        <FaSignOutAlt className="text-lg" />
        <span className="hidden md:block">Logout</span>
      </button>
      </div>

      
    </aside>
  );
};

export default AdminSidebar;
