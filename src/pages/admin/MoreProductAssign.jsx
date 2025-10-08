import React, { useState, useEffect, useCallback } from "react";
import { PuffLoader } from "react-spinners";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiUser,
  FiBriefcase,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import axios from "axios";

const MoreProductAssign = () => {
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [productList, setProductList] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [designation, setDesignation] = useState("");
  const [product, setProduct] = useState("");

  const [assignStaff, setAssignStaff] = useState("");
  const [assignProduct, setAssignProduct] = useState("");

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Fetch customers
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/customers/companyName`
      );
      const result = await res.json();
      setCustomerList(result.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch staff + products
  const fetchStaffAndProducts = useCallback(async () => {
    try {
      setLoading(true);
      const [staffRes, productRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/staff`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/products`),
      ]);

      const staffData = await staffRes.json();
      const productData = await productRes.json();

      setStaffList(staffData.data || []);
      setProductList(productData.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch staff/products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
    fetchStaffAndProducts();
  }, [fetchCustomers, fetchStaffAndProducts]);

  // Auto-fill product & person when company selected
  useEffect(() => {
    const selectedCompany = customerList.find(
      (c) => c.companyName === companyName
    );

    if (selectedCompany) {
      setProduct(selectedCompany.assignedProducts?.name || "");

      if (selectedCompany.persons?.length === 1) {
        const onlyPerson = selectedCompany.persons[0];
        setPersonName(onlyPerson.fullName);
        setDesignation(onlyPerson.designation || "");
      } else {
        setPersonName("");
        setDesignation("");
      }
    } else {
      setProduct("");
      setPersonName("");
      setDesignation("");
    }
  }, [companyName, customerList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!companyName || !assignStaff || !assignProduct) {
        toast.error("Please fill all required fields");
        return;
      }

      const payload = {
        companyName,
        personName,
        designation,
        product,
        assignStaff,
        assignProduct,
      };

      const headers = {
        Authorization: `Bearer ${userInfo?.token}`,
      };

      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/moreProductAssign`,
        payload,
        { headers }
      );
      toast.success("Product assigned successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompanyName("");
    setPersonName("");
    setDesignation("");
    setProduct("");
    setAssignStaff("");
    setAssignProduct("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#1d4ed8" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            More Product Assign
          </h1>
          <p className="text-gray-500 text-sm">
            Assign additional products to customers easily
          </p>
        </div>
       
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-6"
      >
        {/* First Section — Company, Person, Designation, Product */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Company Name
            </label>
            <select
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
              required
            >
              <option value="">Select Company</option>
              {customerList.map((c) => (
                <option key={c._id} value={c.companyName}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Person */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Person
            </label>
            {(() => {
              const selectedCompany = customerList.find(
                (c) => c.companyName === companyName
              );

              if (selectedCompany?.persons?.length === 1) {
                const onlyPerson = selectedCompany.persons[0];
                return (
                  <input
                    type="text"
                    readOnly
                    value={onlyPerson.fullName}
                    className="w-full pl-3 pr-4 p-2.5 border border-gray-300 rounded-lg bg-gray-100"
                  />
                );
              }

              return (
                <select
                  value={personName}
                  onChange={(e) => {
                    setPersonName(e.target.value);
                    const pObj = selectedCompany?.persons?.find(
                      (p) => p.fullName === e.target.value
                    );
                    setDesignation(pObj?.designation || "");
                  }}
                  disabled={!companyName}
                  className="w-full pl-3 pr-4 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary"
                >
                  <option value="">Select person</option>
                  {selectedCompany?.persons?.map((p, i) => (
                    <option key={i} value={p.fullName}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              );
            })()}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Designation
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full pl-10 pr-4 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary"
                placeholder="Operator"
              />
            </div>
          </div>

          {/* Product (Auto-filled) */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Products
            </label>
            <input
              type="text"
              readOnly
              value={product}
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-100"
              placeholder="Auto-filled product"
            />
          </div>
        </div>

        {/* Second Section — Assign */}
        <div className="border rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Assign</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assign to Staff */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Assign to Staff
              </label>
              <select
                value={assignStaff}
                onChange={(e) => setAssignStaff(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary"
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.username}
                  </option>
                ))}
              </select>
            </div>

            {/* Assign Product */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Assign Product
              </label>
              <select
                value={assignProduct}
                onChange={(e) => setAssignProduct(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary"
              >
                <option value="">Select Product</option>
                {productList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 md:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-newPrimary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primaryDark transition"
          >
            Save Assignment
          </button>
        </div>
      </form>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default MoreProductAssign;
