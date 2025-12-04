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
import StaffTrackViewModal from "../../components/Dashboard/StaffTrackViewModal";
import { Eye } from "lucide-react";

const StaffTrack = () => {
  const [isView, setIsView] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
const [originalRecords, setOriginalRecords] = useState([]);

  const [records, setRecords] = useState([]);
  const [staff, setStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [product, setProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [range, setRange] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { label: "Today", value: "today" },
    { label: "1 Week", value: "1week" },
    { label: "14 Days", value: "14days" },
    { label: "1 Month", value: "1month" },
    { label: "All", value: "all" },
  ];

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // ✅ Check if filters are applied
  const hasFilters = staff !== "" || product !== "" || range !== "all";

  // ✅ Fetch Staff Login History
  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/history/staff-track`
        );
        console.log(res);

        setRecords(res.data.data || []);
        setOriginalRecords(res.data.data || []);

      } catch (err) {
        console.error("Error fetching staff login history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoginHistory();
  }, []);

  // ✅ Clear filters
  const handleClearFilters = () => {
    setStaff("");
    setProduct("");
    setRange("all");
  };

  // ✅ Fetch Staff Activity Data
  // useEffect(() => {
  //   const fetchStaffRecords = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_API_BASE_URL}/staff/track`,
  //         {
  //           headers: { Authorization: `Bearer ${userInfo?.token}` },
  //           params: {
  //             staffId: staff,
  //             productId: product,
  //             range
  //           }

  //         }
  //       );
  //       setRecords(res.data.data || []);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStaffRecords();
  // }, [staff, product, range]);

  // ✅ Fetch Staff List
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

  // ✅ Fetch Product List
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

  // ✅ Search filter
const filteredData = originalRecords
  .filter(item => item.staff !== "Admin")  // 🚀 EXCLUDE ADMIN
  .filter((item) => {
    const q = searchQuery.toLowerCase();

    // STAFF FILTER
    if (staff && item.staffId !== staff) return false;

    // PRODUCT FILTER
    if (product && item.productId !== product) return false;

    // RANGE FILTER
    if (range !== "all") {
      const loginDate = new Date(item.lastLoginAt);
      const today = new Date();
      const diffDays = Math.floor((today - loginDate) / (1000 * 60 * 60 * 24));

      if (range === "today" && diffDays !== 0) return false;
      if (range === "1week" && diffDays > 7) return false;
      if (range === "14days" && diffDays > 14) return false;
      if (range === "1month" && diffDays > 30) return false;
    }

    // SEARCH
    return (
      item.staff?.toLowerCase().includes(q) ||
      item.company?.toLowerCase().includes(q) ||
      item.product?.toLowerCase().includes(q) ||
      item.action?.toLowerCase().includes(q)
    );
  });



  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Staff Performance Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor staff follow-ups, assigned clients, and performance trends.
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

      {/* ✅ Filters Section */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 bg-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Staff Filter */}
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
                    {s.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Filter */}
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

            {/* Range Filter */}
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

      {/* ✅ Staff Login History Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-[850px] w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-4 w-[60px]">Sr</th>
              <th className="py-3 px-4 w-[200px]">Staff Name</th>
              <th className="py-3 px-4 w-[120px]">Status</th>
              <th className="py-3 px-4 w-[180px] text-center">Last Login</th>
              <th className="py-3 px-4 w-[180px] text-center">Last Logout</th>
              <th className="py-3 px-4 w-[100px] text-center">Total Logins</th>
              <th className="py-3 px-4 w-[100px] text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((r, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {i + 1}
                  </td>

                  <td className="py-3 px-4 text-gray-900 truncate">
                    {r.staff}
                  </td>

                  {/* Status from r.action */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${r.action === "Staff active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {r.action}
                    </span>
                  </td>

                  {/* Last Login */}
                  <td className="py-3 px-4 text-center text-gray-700">
                    {r.lastLoginAt
                      ? new Date(r.lastLoginAt).toLocaleString()
                      : "—"}
                  </td>

                  {/* Last Logout */}
                  <td className="py-3 px-4 text-center text-gray-700">
                    {r.lastLogoutAt
                      ? new Date(r.lastLogoutAt).toLocaleString()
                      : "—"}
                  </td>

                  {/* Total Logins */}
                  <td className="py-3 px-4 text-center text-gray-900 font-semibold">
                    {r.loginHistory?.length || 0}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedRecord(r);
                        setIsView(true);
                      }}
                      className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-8 text-gray-500 rounded-lg"
                >
                  No staff login activity found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isView && selectedRecord && (
        <StaffTrackViewModal
          data={selectedRecord}
          onClose={() => setIsView(false)}
        />
      )}
    </div>
  );
};

export default StaffTrack;
