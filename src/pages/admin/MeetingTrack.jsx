import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiShoppingBag,
  FiCalendar,
  FiX,
} from "react-icons/fi";

const MeetingTrack = () => {
  const [meetings, setMeetings] = useState([]);
  const [staff, setStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [product, setProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [range, setRange] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { label: "Today", value: "1" },
    { label: "1 Week", value: "7" },
    { label: "14 Days", value: "14" },
    { label: "1 Month", value: "30" },
    { label: "All", value: "all" },
  ];

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // ✅ Check if any filters are active
  const hasFilters = staff !== "" || product !== "" || range !== "all";

  // ✅ Clear all filters
  const handleClearFilters = () => {
    setStaff("");
    setProduct("");
    setRange("all");
  };

  // ✅ Fetch Meeting Data
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/meetings/history`,
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
            params: { staff, product, range },
          }
        );
        setMeetings(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, [staff, product, range]);

  // ✅ Fetch Staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/staff`
        );
        setStaffList(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaff();
  }, []);

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`
        );
        setProductList(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter by search
  const filteredMeetings = meetings.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.companyName?.toLowerCase().includes(q) ||
      m.person?.fullName?.toLowerCase().includes(q) ||
      m.product?.name?.toLowerCase().includes(q) ||
      m.status?.toLowerCase().includes(q) ||
      m.action?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Meeting Activity Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor follow-ups, meetings, and assigned staff performance
          </p>
        </div>

        {/* 🔍 Search */}
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
          />
        </div>
      </div>

      {/* ✅ Filter Section */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 bg-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* 🧑‍💼 Staff Filter */}
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-gray-400" />
              <select
                value={staff}
                onChange={(e) => setStaff(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
              >
                <option value="">All Staff</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.username || "Unnamed"}
                  </option>
                ))}
              </select>
            </div>

            {/* 🛍 Product Filter */}
            <div className="relative">
              <FiShoppingBag className="absolute left-3 top-3 text-gray-400" />
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
              >
                <option value="">All Products</option>
                {productList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 📅 Range Filter */}
            <div className="relative">
              <FiCalendar className="absolute left-3 top-3 text-gray-400" />
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
              >
                {filters.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasFilters ? (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
            >
              <FiX size={18} />
              Clear Filters
            </button>
          ) : (
            <div className="flex items-center text-gray-500 gap-2 text-sm">
              <FiFilter className="text-newPrimary" />
              Filters Applied
            </div>
          )}
        </div>
      </div>

      {/* ✅ Meeting Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-[950px] w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-4 w-[60px]">Sr</th>
              <th className="py-3 px-4 w-[200px]">Company</th>
              <th className="py-3 px-4 w-[180px]">Person</th>
              <th className="py-3 px-4 w-[180px]">Product</th>
              <th className="py-3 px-4 w-[160px]">Status</th>
              <th className="py-3 px-4 w-[160px]">Assigned Staff</th>
              <th className="py-3 px-4 text-center w-[180px]">Date & Time</th>
            </tr>
          </thead>

          <tbody>
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map((m, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {i + 1}
                  </td>
                  <td className="py-3 px-4 text-gray-900 truncate">
                    {m.companyName || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {m.person?.fullName || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {m.product?.name || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {m.status || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {m.referToStaff?.username || "—"}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-700">
                    {m.followDates?.[0]
                      ? new Date(m.followDates[0]).toLocaleDateString()
                      : "—"}{" "}
                    {m.followTimes?.[0] || ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-gray-500 rounded-lg"
                >
                  No meeting records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingTrack;
