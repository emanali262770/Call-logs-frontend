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
import { PuffLoader } from "react-spinners";

const FollowUpTrack = () => {
  const [followUps, setFollowUps] = useState([]);
  const [staff, setStaff] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [product, setProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [range, setRange] = useState("all");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;


 const filters = [
    { label: "Today", value: "today" },
    { label: "1 Week", value: "1week" },
    { label: "14 Days", value: "14days" },
    { label: "1 Month", value: "1month" },
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

  // ✅ Fetch FollowUps
  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/history/followup-track`,
          {
            headers: { Authorization: `Bearer ${userInfo?.token}` },
            params: { staff, product, range },
          }
        );
        setFollowUps(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, [staff, product, range]);

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

  // ✅ Search Filter
const filteredData = followUps.filter((item) => {
  const q = searchQuery.trim().toLowerCase();

  return (
    item.companyName?.toLowerCase().includes(q) ||
    item.persons?.some((p) => p.fullName?.toLowerCase().includes(q)) ||
    item.product?.name?.toLowerCase().includes(q) ||
    item.assignedStaff?.username?.toLowerCase().includes(q) ||
    item.status?.toLowerCase().includes(q) ||
    item.Timeline?.toLowerCase().includes(q) ||
    item.details?.some((d) => d?.toLowerCase().includes(q))
  );
});

 useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PuffLoader height="150" width="150" radius={1} color="#1d4ed8" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Follow-Up Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            View and monitor all follow-up activities with customers.
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

      {/* ✅ Filters */}
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

      {/* ✅ Table */}
      {/* ✅ Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-4 w-[60px]">Sr</th>
              <th className="py-3 px-4 w-[200px]">Company</th>
              <th className="py-3 px-4 w-[160px]">Person</th>
              <th className="py-3 px-4 w-[180px]">Product</th>
              <th className="py-3 px-4 w-[160px]">Status</th>
              <th className="py-3 px-4 w-[160px]">Assigned Staff</th>
              <th className="py-3 px-4 w-[180px]">Follow-Up Date & Time</th>
              <th className="py-3 px-4 w-[200px]">Details</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              currentItems.map((f, i) => (
                <tr key={i} className="border-b hover:bg-gray-50 transition">
                  {/* Sr No */}
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {i + 1}
                  </td>

                  {/* 🏢 Company */}
                  <td className="py-3 px-4 text-gray-900 truncate">
                    {f.companyName || "—"}
                  </td>

                  {/* 👤 Person */}
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {f.persons?.[0]?.fullName || "—"}
                  </td>

                  {/* 🛍️ Product */}
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {f.product?.name || "—"}
                  </td>

                  {/* 📋 Status (with colored pill) */}
                  <td className="py-3  ">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${
                    f.status === "Follow Up Required"
                      ? "bg-yellow-100 text-yellow-800"
                      : f.status === "Not Interested"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                    >
                      {f.status || "—"}
                    </span>
                  </td>

                  {/* 👩‍💼 Assigned Staff */}
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {f.assignedStaff?.username || "—"}
                  </td>

                  {/* ⏱️ Follow-Up Date & Time */}
                  <td className="py-3 px-4 text-center text-gray-700">
                    {f.followDates?.[0]
                      ? new Date(f.followDates[0]).toLocaleDateString()
                      : "—"}{" "}
                    {f.followTimes?.[0] ? f.followTimes[0] : ""}
                  </td>

                  {/* 📝 Details */}
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {f.details?.[0] || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-8 text-gray-500 rounded-lg"
                >
                  No follow-up records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       {/* ✅ Pagination Controls */}
      {filteredData.length > itemsPerPage && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* Prev Button */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                currentPage === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
            >
              Prev
            </button>

            {/* Dynamic Page Numbers */}
            {(() => {
              const pageButtons = [];
              if (currentPage > 3) {
                pageButtons.push(1);
                if (currentPage > 4) pageButtons.push("...");
              }
              for (
                let i = Math.max(1, currentPage - 2);
                i <= Math.min(totalPages, currentPage + 2);
                i++
              ) {
                pageButtons.push(i);
              }
              if (currentPage < totalPages - 2) {
                if (currentPage < totalPages - 3) pageButtons.push("...");
                pageButtons.push(totalPages);
              }

              return pageButtons.map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 py-1 text-gray-500">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md border text-sm font-medium transition-all duration-200 ${
                      currentPage === page
                        ? "bg-newPrimary text-white border-newPrimary shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            {/* Next Button */}
            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className={`px-4 py-2 border rounded-lg transition-all duration-200 ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUpTrack;
