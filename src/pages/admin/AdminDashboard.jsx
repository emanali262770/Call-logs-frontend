import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiUser,
  FiSearch,
  FiMessageSquare,
  FiShoppingBag,
  FiUsers,
  FiFileText,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiMenu,
  FiX,
  FiChevronRight,
  FiActivity,
  FiStar,
  FiTarget,
} from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { MdOpenInNew } from "react-icons/md";
import Swal from "sweetalert2";
import { CardSkeleton } from "./CardSkeleton";
import { toast } from "react-toastify";
import {
  FollowUpMeetingsSkeleton,
  MonthlyCallTrendsSkeleton,
  PerformanceSummarySkeleton,
  WeeklyCallVolumeSkeleton,
} from "./ChartSkeleton";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const [customers, setCustomers] = useState(0);
  const [items, setItems] = useState(0);
  const [sales, setSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [callData, setCallData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [pieData, setPieData] = useState([]);

  const [cardsLoading, setCardsLoading] = useState(true);
  const [calendarMeetings, setCalendarMeetings] = useState([]);
  const [totalMeetings, setTotalMeetings] = useState(0);

  const abortRef = useRef(null);
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = userInfo?.username || "Admin User";
  const userEmail = userInfo?.email || "admin@example.com";
  let userRole = userInfo?.role || "Administrator";
  if (userRole === "user") {
    userRole = "Staff";
  }
  const base = import.meta.env.VITE_API_BASE_URL;

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/"); // go back to login page
  };

  // ✅ Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const headers = {
    Authorization: `Bearer ${userInfo?.token}`,
  };
  // fetch pie data
  useEffect(() => {
    async function pieDataApi() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/performance-summary`,
          { headers }
        );

        const formattedPie = [
          {
            name: "Success Rate",
            value: res.data.data.successRate || 0,
            color: "#10b981",
          },
          {
            name: "Pending Calls",
            value: res.data.data.pendingCalls || 0,
            color: "#f59e0b",
          },
          {
            name: "Follow Ups",
            value: res.data.data.followUps || 0,
            color: "#3b82f6",
          },
        ];
        setPieData(formattedPie);
      } catch (error) {
        // ✅ Extract message from backend
        const backendMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";

        setTimeout(() => {
          toast.error(`❌ ${backendMessage}`);
        }, 2000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    pieDataApi();
  }, []);

  // fetch day data
  useEffect(() => {
    async function DaysDataApi() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/weekly-volume`,
          { headers }
        );
        console.log({ res });

        if (res.data?.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((item) => ({
            name: item.day, // For X-Axis
            calls: item.count, // For Y-Axis
          }));
          setDayData(formatted);

          if (formatted.every((d) => d.calls === 0)) {
            toast.info("No calls recorded this week.");
          }
        }
      } catch (error) {
        const backendMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setTimeout(() => {
          toast.error(`❌ ${backendMessage}`);
        }, 2000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    DaysDataApi();
  }, []);

  // fetch Montly Trend
  useEffect(() => {
    async function MontlyTrendDataApi() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/monthly-trends`,
          { headers }
        );
        console.log({ res });

        if (res.data?.success && Array.isArray(res.data.data)) {
          const formatted = res.data.data.map((item) => ({
            name: item.month, // ✅ for X-axis
            calls: item.count, // ✅ for bar height
          }));

          setCallData(formatted);

          // Optional: log total calls
          // console.log("Total Calls:", res.data.totalCalls);

          // Optional toast
          if (res.data.totalCalls === 0) {
            toast.info("No calls recorded this year.");
          }
        }
      } catch (error) {
        const backendMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";
        setTimeout(() => {
          toast.error(`❌ ${backendMessage}`);
        }, 2000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }
    MontlyTrendDataApi();
  }, []);

  // ✅ Fetch Calendar Meetings (based on current month)
  useEffect(() => {
    async function fetchCalendarMeetings() {
      try {
        setLoading(true);

        // ✅ Format month as YYYY-MM
        const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-10"

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL
          }/dashboard/calendar-meetings?month=${currentMonth}`,
          { headers }
        );
        // console.log("📅 Calendar Meetings:", res.data);

        if (res.data?.success) {
          setCalendarMeetings(res.data.data || []);
          setTotalMeetings(res.data.totalMeetings || 0);

          if ((res.data.data || []).length === 0) {
            toast.info("No meetings scheduled for this month.");
          }
        }
      } catch (error) {
        const backendMessage =
          error.response?.data?.message ||
          "Something went wrong fetching calendar meetings.";
        setTimeout(() => {
          toast.error(`❌ ${backendMessage}`);
        }, 2000);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    }

    fetchCalendarMeetings();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`${base}/customers/count`, {
          headers,
          signal: controller.signal,
        });
        // console.log("Res ", res.data);

        setCustomers(res.data?.totalCustomers ?? 0);
      } catch (err) {
        if (err.name !== "CanceledError") console.error("Fetch failed:", err);
      }
    };

    // 🕒 First call immediately
    fetchCustomers();

    // ⏱️ Then repeat every 60 seconds
    const interval = setInterval(fetchCustomers, 60000);

    // 🧹 Cleanup on unmount
    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [customers]);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchAllCounts = async () => {
      setCardsLoading(true);

      try {
        const [itemsRes, usersRes, salesRes, notificationsRes] =
          await Promise.all([
            axios.get(`${base}/products/count`, { signal: controller.signal }),
            axios.get(`${base}/group-users/count`, {
              signal: controller.signal,
            }),
            axios.get(
              `${base}/orders/total`,
              { headers },
              { signal: controller.signal }
            ),
            axios.get(`${base}/notifications`, {
              headers: { Authorization: `Bearer ${userInfo.token}` },
              signal: controller.signal,
            }),
          ]);

        setItems(itemsRes.data?.totalProducts ?? 0);
        setUsers(usersRes.data?.totalUsers ?? 0);
        setSales(salesRes.data?.totalSales ?? 0);
        setNotifications(notificationsRes.data || []);
      } catch (error) {
        console.error("Error fetching count data:", error);
      } finally {
        setTimeout(() => {
          setCardsLoading(false);
        }, 3000);
      }
    };

    fetchAllCounts();

    return () => controller.abort();
  }, []);

  // ✅ Mark single notification as read
  const clearNotification = async (id) => {
    try {
      await axios.put(`${base}/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Clear failed:", err);
    }
  };

  // ✅ Mark all notifications as read
  const clearAll = async () => {
    try {
      await axios.put(
        `${base}/notifications/mark-all`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setNotifications([]); // clear local state
    } catch (err) {
      console.error("Clear all failed:", err);
    }
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const summaryData = [
    {
      name: "Customers",
      value: customers,
      icon: <FiUsers className="text-blue-500 text-xl" />,
      change: "+12%",
      color: "bg-blue-100",
    },
    {
      name: "Products",
      value: items,
      icon: <FiShoppingBag className="text-green-500 text-xl" />,
      change: "+5%",
      color: "bg-green-100",
    },
    {
      name: "Staff",
      value: users,
      icon: <FiUser className="text-purple-500 text-xl" />,
      change: "+2%",
      color: "bg-purple-100",
    },
    {
      name: "Transactions",
      value: sales,
      icon: <FiFileText className="text-amber-500 text-xl" />,
      change: "+8%",
      color: "bg-amber-100",
    },
  ];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const openNotifModal = (notif) => {
    Swal.fire({
      title: notif?.title ?? "Details",
      text: notif?.message ?? "No description available.",
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="flex justify-between items-center px-4 py-3 md:px-6">
          <div className="flex items-center">
            <button
              className="md:hidden mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-indigo-600">
                Call Logs Dashboard
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

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search - hidden on mobile */}
            <div className="relative hidden md:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-48 transition-all duration-300 focus:w-56"
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 relative transition-colors duration-200"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center font-semibold border-2 border-white
    ${unreadCount < 10
                        ? "w-4 h-4 text-[10px]"
                        : unreadCount < 100
                          ? "w-5 h-5 text-[10px]"
                          : "min-w-[26px] h-5 px-[4px] text-[9px]"
                      }
  `}
                  >
                    {unreadCount < 100 ? unreadCount : "99+"}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
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
                              className=" text-gray-400  hover:text-red-500"
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

            {/* User Profile */}
            {/* User Profile with Popover */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white shadow-md">
                    <FiUser size={16} />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                </div>

                <div className="hidden md:block text-right">
                  <div className="text-sm font-medium capitalize">
                    {userName}
                  </div>
                  <div className="text-xs text-gray-500 uppercase">
                    {userRole}
                  </div>
                </div>
              </button>

              {/* Popover Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium capitalize text-gray-800">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => navigate("/admin/settings/profile")}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600  transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
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

      {/* Main Content */}
      <main className="p-4 md:p-6">
        {/* Welcome Header */}
        <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Welcome back, {userName}!
              </h1>
              <p className="text-indigo-100 mt-1">
                Here's what's happening with your call logs today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
              <FiActivity className="animate-pulse" />
              <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {cardsLoading
            ? Array.from({ length: summaryData.length }).map((_, idx) => (
              <CardSkeleton key={idx} />
            ))
            : summaryData.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transform hover:-translate-y-1 transition-all duration-500 ${cardsLoading ? "opacity-0" : "opacity-100"
                  }`}
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex justify-between items-start relative z-10">
                  <div
                    className={`p-2 md:p-3 rounded-lg ${item.color} transition-colors duration-300 group-hover:scale-110`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-medium ${item.change.includes("+")
                      ? "text-green-600"
                      : "text-red-600"
                      }`}
                  >
                    {item.change}
                  </span>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="text-2xl md:text-3xl font-bold text-gray-800">
                    {item.value}
                  </div>
                  <div className="text-gray-500 text-sm md:text-base mt-1">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {loading ? (
            // 🦴 Skeletons while data is loading
            <>
              <PerformanceSummarySkeleton />
              <WeeklyCallVolumeSkeleton />
            </>
          ) : (
            <>
              {/* 🎯 Performance Summary Chart */}
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Performance Summary
                  </h2>
                  <FiTarget className="text-indigo-500" />
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {pieData.map((entry, index) => (
                    <div key={index} className="text-center">
                      <div className="h-40 w-40 mx-auto relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { value: entry.value > 99.5 ? 99.5 : entry.value < 3 && entry.value > 0 ? 3 : entry.value },
                                { value: 100 - entry.value },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              startAngle={90}
                              endAngle={-270}
                              dataKey="value"
                            >
                              <Cell key={`cell-${index}`} fill={entry.color} />
                              <Cell key={`cell-bg-${index}`} fill="#e5e7eb" />
                            </Pie>

                            <Tooltip
                              formatter={(value) => [`${value}%`, "Percentage"]}
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                boxShadow:
                                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-lg font-bold"
                            style={{ color: entry.color }}
                          >
                            {entry.value}%
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mt-2">
                        {entry.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 📅 Follow-up Meetings */}
              <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Follow-up Meetings
                  </h2>
                  <div className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                    {currentTime.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
                  {/* Weekday headers */}
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                    <div
                      key={day + idx}
                      className="font-medium text-gray-500 py-2"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar dates */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                    const hasMeeting = calendarMeetings.some(
                      (m) => new Date(m.date).getDate() === date
                    );
                    return (
                      <div
                        key={date}
                        className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${hasMeeting
                          ? "bg-blue-100 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {date}
                      </div>
                    );
                  })}
                </div>

                {/* Summary row */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Scheduled meetings this month
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {totalMeetings} meetings
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Monthly Call Trends + Follow-up Meetings Section */}
        {loading ? (
          // 🦴 Skeleton view
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <MonthlyCallTrendsSkeleton />
            <FollowUpMeetingsSkeleton />
          </div>
        ) : (
          // 📊 Actual charts view
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* 📞 Monthly Call Trends */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Monthly Call Trends
                </h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center">
                  View report <FiChevronRight className="ml-1" />
                </button>
              </div>

              {/* Total calls text */}
              <div className="text-2xl md:text-3xl font-bold text-newPrimary mb-4">
                {callData.reduce((total, month) => total + month.calls, 0)}{" "}
                calls
              </div>

              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                    />
                    <Bar dataKey="calls" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 📊 Weekly Call Volume Chart */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Weekly Call Volume
                </h2>
                <FiTrendingUp className="text-green-500" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                    />
                    <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
