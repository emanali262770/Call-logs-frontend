import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiSearch, FiBell, FiUser, FiCalendar, FiClock } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";

const AppHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✅ user info
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = userInfo?.username || "Admin User";
  let userRole = userInfo?.role || "Administrator";
  if (userRole === "user") userRole = "Staff";

  const base = import.meta.env.VITE_API_BASE_URL;
  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  // ✅ fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get(`${base}/notifications`, { headers });
        setNotifications(res.data || []);
      } catch (error) {
        toast.error("Failed to fetch notifications");
      }
    }
    fetchNotifications();
  }, []);

  // ✅ Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const clearNotification = async (id) => {
    try {
      await axios.put(`${base}/notifications/${id}/read`, {}, { headers });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Failed to clear notification");
    }
  };

  const clearAll = async () => {
    try {
      await axios.put(`${base}/notifications/mark-all`, {}, { headers });
      setNotifications([]);
    } catch {
      toast.error("Failed to clear all notifications");
    }
  };

  const openNotifModal = (notif) => {
    Swal.fire({
      title: notif?.title ?? "Details",
      text: notif?.message ?? "No description available.",
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="flex justify-between items-center px-4 py-3 md:px-6">
        {/* Left Section */}
        <div className="flex items-center">
          <button
            className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-indigo-600">
             Infinitybyte CRM Dashboard
            </h1>
            <div className="flex items-center mt-1 text-xs md:text-sm text-gray-500">
              <FiCalendar className="mr-1 hidden sm:block" />
              <span className="hidden sm:block">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <FiClock className="ml-0 sm:ml-3 mr-1" />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 transition-all duration-300 focus:w-56"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="flex justify-between items-center p-2 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        className="flex justify-between items-start p-3 border-b hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-gray-600">
                            {notif.message}
                          </p>
                        </div>
                        <div className="flex cursor-pointer items-center gap-1">
                          <button
                            onClick={() => openNotifModal(notif)}
                            className="p-1 hover:text-blue-600"
                          >
                            <MdOpenInNew size={12} className="text-primary" />
                          </button>

                          <button
                            onClick={() => clearNotification(notif._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <IoClose size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                <FiUser size={16} />
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium capitalize">{userName}</div>
              <div className="text-xs text-gray-500 uppercase">{userRole}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-3 md:hidden transition-all duration-300 ease-in-out">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full transition-all duration-300"
          />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
