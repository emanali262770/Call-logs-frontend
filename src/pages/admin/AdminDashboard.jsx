import React, { useEffect, useState } from "react";
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
  Legend
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
  FiTarget
} from "react-icons/fi";

const AdminDashboard = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [performanceData, setPerformanceData] = useState([]);
  const [callData, setCallData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [radialData, setRadialData] = useState([]);
  
  // Get user info from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userName = userInfo?.name || "Admin User";
  const userEmail = userInfo?.email || "admin@example.com";
  const userRole = userInfo?.role || "Administrator";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          allProductsRes, 
          recentProductsRes, 
          usersRes, 
          transactionsRes,
          notificationsRes,
          performanceRes,
          callDataRes,
          dayDataRes,
          pieDataRes,
          radialDataRes
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?limit=5&sort=desc`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/users`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/notifications`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/performance`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/calls/monthly`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/calls/weekly`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/performance/summary`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/goals`),
        ]);

        setAllProducts(allProductsRes.data.data);
        setRecentProducts(recentProductsRes.data.data);
        setUsers(usersRes.data.data);
        setTransactions(transactionsRes.data.data);
        setNotifications(notificationsRes.data.data);
        setPerformanceData(performanceRes.data.data);
        setCallData(callDataRes.data.data);
        setDayData(dayDataRes.data.data);
        setPieData(pieDataRes.data.data);
        setRadialData(radialDataRes.data.data);
        
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Fallback to static data if API calls fail
        setNotifications([
          { id: 1, message: "New user registered", time: "2 mins ago", read: false },
          { id: 2, message: "Order #1234 completed", time: "1 hour ago", read: false },
          { id: 3, message: "System update available", time: "5 hours ago", read: true }
        ]);
        setPerformanceData([
          { name: 'Week 1', efficiency: 75, satisfaction: 85 },
          { name: 'Week 2', efficiency: 60, satisfaction: 78 },
          { name: 'Week 3', efficiency: 85, satisfaction: 90 },
          { name: 'Week 4', efficiency: 70, satisfaction: 82 },
        ]);
        setCallData([
          { name: "Jan", calls: 20 },
          { name: "Feb", calls: 35 },
          { name: "Mar", calls: 50 },
          { name: "Apr", calls: 45 },
          { name: "May", calls: 60 },
          { name: "Jun", calls: 70 },
          { name: "Jul", calls: 80 },
          { name: "Aug", calls: 100 },
          { name: "Sep", calls: 90 },
          { name: "Oct", calls: 75 },
          { name: "Nov", calls: 65 },
          { name: "Dec", calls: 55 },
        ]);
        setDayData([
          { name: "Sun", calls: 15 },
          { name: "Mon", calls: 22 },
          { name: "Tue", calls: 18 },
          { name: "Wed", calls: 25 },
          { name: "Thu", calls: 20 },
          { name: "Fri", calls: 30 },
          { name: "Sat", calls: 12 },
        ]);
        setPieData([
          { name: "Success Rate", value: 81, color: "#10b981" },
          { name: "Pending Calls", value: 22, color: "#f59e0b" },
          { name: "Follow Ups", value: 62, color: "#3b82f6" },
        ]);
        setRadialData([
          { name: 'Goal Completion', value: 78, fill: '#8884d8' },
          { name: 'Target Achievement', value: 65, fill: '#83a6ed' },
          { name: 'Productivity', value: 92, fill: '#8dd1e1' },
        ]);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Dynamic data for summary cards based on API responses
  const summaryData = [
    { name: "Customers", value: users.length, icon: <FiUsers className="text-blue-500 text-xl" />, change: "+12%", color: "bg-blue-100" },
    { name: "Products", value: allProducts.length, icon: <FiShoppingBag className="text-green-500 text-xl" />, change: "+5%", color: "bg-green-100" },
    { name: "Staff", value: users.filter(user => user.role === 'staff').length, icon: <FiUser className="text-purple-500 text-xl" />, change: "+2%", color: "bg-purple-100" },
    { name: "Transactions", value: transactions.length, icon: <FiFileText className="text-amber-500 text-xl" />, change: "+8%", color: "bg-amber-100" },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="text-center">
          <PuffLoader color="#3b82f6" size={80} />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-xl md:text-2xl font-bold text-indigo-600">Call Logs Dashboard</h1>
              <div className="flex items-center mt-1 text-xs md:text-sm text-gray-500">
                <FiCalendar className="mr-1 hidden sm:block" />
                <span className="hidden sm:block">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                  <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 md:w-80 bg-white rounded-lg shadow-xl z-10 border border-gray-200 animate-fadeIn">
                  <div className="p-3 border-b border-gray-200 font-semibold flex justify-between items-center">
                    <span>Notifications</span>
                    <button 
                      className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors duration-200"
                      onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex justify-between">
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                              {notification.message}
                            </p>
                            {!notification.read && (
                              <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 ml-2"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No notifications</div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-200 text-center">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white">
                  <FiUser size={16} />
                </div>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
              </div>
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium uppercase">{userName}</div>
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

      {/* Main Content */}
      <main className="p-4 md:p-6">
        {/* Welcome Header */}
        <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 md:p-6 rounded-xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Welcome back, {userName}!</h1>
              <p className="text-indigo-100 mt-1">Here's what's happening with your call logs today.</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
              <FiActivity className="animate-pulse" />
              <span>Last updated: {currentTime.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {summaryData.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
              {/* Animated background element */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className={`p-2 md:p-3 rounded-lg ${item.color} transition-colors duration-300 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <span className={`text-xs md:text-sm font-medium ${item.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                </span>
              </div>
              <div className="mt-4 relative z-10">
                <div className="text-2xl md:text-3xl font-bold text-gray-800">{item.value}</div>
                <div className="text-gray-500 text-sm md:text-base mt-1">{item.name}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Performance Summary */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Performance Summary</h2>
              <FiTarget className="text-indigo-500" />
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {pieData.map((entry, index) => (
                <div key={index} className="text-center">
                  <div className="h-40 w-40 mx-auto relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: entry.value }, { value: 100 - entry.value }]}
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
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '6px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold" style={{ color: entry.color }}>
                        {entry.value}%
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mt-2">{entry.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Call Volume */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Weekly Call Volume</h2>
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
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                  <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Total Calls and Follow up Meetings side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Calls */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Monthly Call Trends</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center">
                View report <FiChevronRight className="ml-1" />
              </button>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-newPrimary mb-4">
              {callData.reduce((total, month) => total + month.calls, 0)} calls
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={callData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }} 
                  />
                  <Bar dataKey="calls" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Follow up Meetings */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Follow up Meetings</h2>
              <div className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-4">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              {[29, 30, 1, 2, 3, 4, 5].map((date) => (
                <div
                  key={`row1-${date}`}
                  className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${[2, 15, 25].includes(date) ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {date}
                </div>
              ))}
              {[6, 7, 8, 9, 10, 11, 12].map((date) => (
                <div
                  key={`row2-${date}`}
                  className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${[2, 15, 25].includes(date) ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {date}
                </div>
              ))}
              {[13, 14, 15, 16, 17, 18, 19].map((date) => (
                <div
                  key={`row3-${date}`}
                  className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${[2, 15, 25].includes(date) ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {date}
                </div>
              ))}
              {[20, 21, 22, 23, 24, 25, 26].map((date) => (
                <div
                  key={`row4-${date}`}
                  className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${[2, 15, 25].includes(date) ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {date}
                </div>
              ))}
              {[27, 28, 29, 30, 31, 1, 2].map((date) => (
                <div
                  key={`row5-${date}`}
                  className={`p-1 md:p-2 rounded-full transition-colors duration-200 ${[2, 15, 25].includes(date) ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {date}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Scheduled meetings</span>
              </div>
              <span className="text-sm font-medium text-blue-600">12 meetings</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;