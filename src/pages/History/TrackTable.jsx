import React, { useState, useEffect } from "react";
import axios from "axios";

const TrackTable = ({ apiUrl, columns, title }) => {
  const [data, setData] = useState([]);
  const [staff, setStaff] = useState("");
  const [staffList, setStaffList] = useState([]); // ✅ list from API
  const [product, setProduct] = useState("");
  const [range, setRange] = useState("all");

  const filters = [
    { label: "Today", value: "1" },
    { label: "1 Week", value: "7" },
    { label: "14 Days", value: "14" },
    { label: "1 Month", value: "30" },
    { label: "All", value: "all" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
        const res = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
          params: { staff, product, range },
        });
        setData(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [apiUrl, staff, product, range]);

  // Staff 
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/staff`);
        // console.log("res ", res.data.data);

        setStaffList(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStaffData();
  }, [staff]);

  // Product
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        setProduct(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProductData();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        <div className="flex gap-2">
          {/* 🧑‍💼 Staff Filter */}
          <select
            value={staff}
            onChange={(e) => setStaff(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            <option value="">All Staff</option>
            {staffList?.length > 0 &&
              staffList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s?.username || "Unnamed"}
                </option>
              ))}
          </select>

          {/* 🛒 Product Filter */}
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            <option value="">All Products</option>
            {product?.length > 0 &&
              product.map((p) => (
                <option key={p._id} value={p._id}>
                  {p?.name || "Unnamed Product"}
                </option>
              ))}
          </select>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm text-gray-600"
          >
            {filters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
              {columns.map((col) => (
                <th key={col} className="py-3 px-4 text-left border-b">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="py-3 px-4">
                      {item[col.toLowerCase()] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackTable;
