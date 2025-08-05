import React, { useEffect, useState } from "react";
import axios from "axios";
import Charts from "../../components/Dashboard/Charts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/table";
import User from "../../components/Dashboard/User";
import { PuffLoader } from "react-spinners"; // ✅ Loader import

const AdminDashboard = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // const [allProductsRes, recentProductsRes, usersRes, transactionsRes] = await Promise.all([
        //   axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`),
        //   axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?limit=5&sort=desc`),
        //   axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/users`),
        //   axios.get(`${import.meta.env.VITE_API_BASE_URL}/transactions`),
        // ]);

        setAllProducts(allProductsRes.data.data);
        setRecentProducts(recentProductsRes.data.data);
        setUsers(usersRes.data.data);
        setTransactions(transactionsRes.data.data);
        // ✅ Delay loader for 2 seconds regardless of speed
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#00c7fc" />
      </div>
    );
  }

  return (
    <div className="p-8 w-full">
      <h1 className="text-3xl font-bold mb-8 text-primary text-center">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-primary">
            {allProducts.length}
          </span>
          <span className="text-gray-600 mt-2">Total Customer</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-primary">
            {users.length}
          </span>
          <span className="text-gray-600 mt-2">Total Users</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-primary">${transactions.reduce((sum, txn) => sum + txn.totalAmount, 0)}</span>
          <span className="text-gray-600 mt-2">Total Transactions</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-bold text-primary">${transactions.reduce((sum, txn) => sum + txn.totalAmount, 0)}</span>
          <span className="text-gray-600 mt-2">Total Revenue</span>
        </div>
      </div>

      {/* Dashboard View */}
      <Charts />

      {/* Recently Added Products & Users */}
      <div className="flex flex-col lg:flex-row gap-6 mt-10">
        {/* Products Table */}
        <div className="bg-white rounded shadow p-6 flex-1 min-w-0">
          <h2 className="text-xl font-semibold mb-4">Recently Added Products</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentProducts.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <img
                          src={product.images?.[0]?.url || "https://via.placeholder.com/64"}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell className="text-primary font-bold">
                        ${product.price}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {product.category?.map((cat) => cat.name).join(", ") || "N/A"}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {product.stock}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* User Card */}
        <div className="w-full lg:w-[22rem] flex-shrink-0">
          <User users={users} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
