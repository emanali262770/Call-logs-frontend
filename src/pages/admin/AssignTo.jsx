import React, { useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import * as XLSX from "xlsx";

const AssignTo = () => {
  const [customerList, setCustomerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [staffMembers, setStaffMember] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [persons, setPersons] = useState([
    { fullName: "", phone: "", email: "", designation: "", department: "" },
  ]);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [assignedProduct, setAssignedProduct] = useState("");
  const [image, setImage] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ✅ new states for checkbox selection
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [showAssignHeader, setShowAssignHeader] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
      setShowPreview(true);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const fetchCustomerData = useCallback(async () => {
    const headers = {
      Authorization: `Bearer ${userInfo?.token}`,
      "Content-Type": "application/json",
    };
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/customers/unassigned`,
        { headers }
      );
      const result = await response.json();
      setCustomerData(result.data || []);
      setFilteredCustomers(result.data || []);
    } catch (error) {
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customerList);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = customerList.filter((customer) => {
        return (
          (customer.companyName || "").toLowerCase().includes(query) ||
          (customer.email || "").toLowerCase().includes(query) ||
          (customer.phoneNumber || "").toLowerCase().includes(query) ||
          (customer.address || "").toLowerCase().includes(query) ||
          (customer.city || "").toLowerCase().includes(query) ||
          (customer.businessType || "").toLowerCase().includes(query)
        );
      });
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customerList]);

  const fetchAssignedData = useCallback(async () => {
    try {
      setLoading(true);
      const [staffRes, productRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/staff`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/products`),
      ]);
      const staff = await staffRes.json();
      const product = await productRes.json();
      setStaffMember(staff.data || []);
      setProductList(product.data || []);
    } catch (error) {
      setTimeout(() => {
        toast.error("Failed to fetch staff/product data");
      }, 2000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignedData();
  }, [fetchAssignedData]);

  // ✅ handle save (assign)
  const handleSave = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token}`,
        "Content-Type": "application/json",
      };
      const payload = {
        customerIds: selectedCustomers,
        assignedStaff,
        assignedProducts: assignedProduct,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/customers/assign`,
        payload,
        { headers }
      );

      toast.success("Customers assigned successfully");
      setSelectedCustomers([]);
      setShowAssignHeader(false);
      setIsSliderOpen(false);
      fetchCustomerData();
    } catch (error) {
      toast.error("Failed to assign customers");
    }
  };

   useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PuffLoader color="#1d4ed8" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Assign List
          </h1>
          <p className="text-gray-500 text-sm">Manage your customer database</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>

          {showAssignHeader && (
            <button
              onClick={() => setIsSliderOpen(true)}
              className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
            >
              Assign Selected ({selectedCustomers.length})
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-2 w-[25px]">Sr</th>
              <th className="py-3 px-4">Business Nature</th>
              <th className="py-3 px-4">Company Name</th>
              <th className="py-3 px-4">City</th>
              <th className="py-3 px-4">Person</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Designation</th>
              <th className="py-3 px-4">Phone</th>
              {userInfo?.isAdmin && (
                <th className="py-3 px-4 text-right w-[90px]">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-gray-600 text-xs font-bold">All</span>
                    <input
                      type="checkbox"
                      className="accent-newPrimary cursor-pointer w-4 h-4"
                      checked={
                        selectedCustomers.length === currentItems.length &&
                        currentItems.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCustomers(currentItems.map((c) => c._id));
                          setShowAssignHeader(true);
                        } else {
                          setSelectedCustomers([]);
                          setShowAssignHeader(false);
                        }
                      }}
                    />
                  </div>
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td
                  colSpan={userInfo?.isAdmin ? 9 : 8}
                  className="py-10 text-center text-gray-500 text-sm"
                >
                  No Assgin Data found
                </td>
              </tr>
            ) : (
              currentItems.map((client, index) => (
                <tr
                  key={index}
                  className={`border-b transition ${
                    selectedCustomers.includes(client._id)
                      ? "bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-2">{indexOfFirstItem + index + 1}</td>
                  <td className="py-3 px-4">{client.businessType || "-"}</td>
                  <td className="py-3 px-4">{client.companyName || "-"}</td>
                  <td className="py-3 px-4">{client.city || "-"}</td>
                  <td className="py-3 px-4">
                    {client.persons?.[0]?.fullName || "-"}
                  </td>
                  <td className="py-3 px-4">
                    {client.persons?.[0]?.department || "-"}
                  </td>
                  <td className="py-3 px-4">
                    {client.persons?.[0]?.designation || "-"}
                  </td>
                  <td className="py-3 px-4">
                    {client.persons?.[0]?.phoneNumber || "-"}
                  </td>

                  {userInfo?.isAdmin && (
                    <td className="py-3 px-4 text-right">
                      <input
                        type="checkbox"
                        className="accent-newPrimary cursor-pointer w-4 h-4"
                        checked={selectedCustomers.includes(client._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const updated = [...selectedCustomers, client._id];
                            setSelectedCustomers(updated);
                            setShowAssignHeader(true);
                          } else {
                            const updated = selectedCustomers.filter(
                              (id) => id !== client._id
                            );
                            setSelectedCustomers(updated);
                            if (updated.length === 0)
                              setShowAssignHeader(false);
                          }
                        }}
                      />
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Assign */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-newPrimary">Assign</h2>
              <button
                className="text-gray-500 text-2xl"
                onClick={() => setIsSliderOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Assign to Staff
                  </label>
                  <select
                    value={assignedStaff}
                    onChange={(e) => setAssignedStaff(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Staff</option>
                    {staffMembers.map((staff) => (
                      <option key={staff._id} value={staff._id}>
                        {staff.username}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">
                    Assign Product
                  </label>
                  <select
                    value={assignedProduct}
                    onChange={(e) => setAssignedProduct(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select Product</option>
                    {productList.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-6 py-2 border rounded-lg text-gray-700"
                  onClick={() => setIsSliderOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-newPrimary text-white px-6 py-2 rounded-lg hover:bg-primaryDark"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pagination */}
      {/* Pagination */}
      {filteredCustomers.length > itemsPerPage && (
        <div className="flex flex-col items-center gap-3 mt-6">
          {/* Pagination Buttons */}
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
              const totalVisible = 5;

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

export default AssignTo;
