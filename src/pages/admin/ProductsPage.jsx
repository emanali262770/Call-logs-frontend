import React, { useEffect, useCallback, useState, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import {
  FiEdit,
  FiSearch,
  FiX,
  FiTrendingUp,
  FiTrendingDown,
  FiPlus,
  FiDollarSign,
  FiBarChart2,
  FiTrash2,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { FaRupeeSign } from "react-icons/fa6";

import { PuffLoader } from "react-spinners";

const ProductsPage = () => {
  // State for slider
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productsByMonths, setProductsByMonths] = useState([]);
  const [orders, setOrders] = useState([]);
  const [formState, setEditFormState] = useState({
    name: "",
    price: "",
    image: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get User from the LocalStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Search functionality
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // slider styling
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { x: "100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
        }
      );
    }
  }, [isSliderOpen]);

  // Handlers
  const handleAddProduct = () => {
    setIsSliderOpen(true);
  };

  // Fetch All Products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const result = await response.json();
      setProducts(result.data);
      setFilteredProducts(result.data);
   
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (err) {
      console.error("Fetch products error:", err);
      setTimeout(() => {
         toast.error("Failed to fetch products!");
      }, 2000);
     
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch All Product Add by Month
  const fetchProductsAddMonths = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/products/analytics/monthly`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product analytics");
      }

      const result = await response.json();
      setProductsByMonths(result.data);
    } catch (err) {
      console.error("Fetch product analytics error:", err);
      toast.error("Failed to fetch product analytics!");
    }
  }, []);

  useEffect(() => {
    fetchProductsAddMonths();
  }, [fetchProductsAddMonths]);

  // Delete Product
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const token = userInfo?.token;
            if (!token) {
              toast.error("Authorization token missing!");
              return;
            }

            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setProducts(products.filter((p) => p._id !== id));

            swalWithTailwindButtons.fire(
              "Deleted!",
              "Product deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete product.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Product is safe 🙂",
            "error"
          );
        }
      });
  };

  // Get Currently Month
  const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleString("default", { month: "long" });
  };
  const month = getCurrentMonth();

  // Fetch All Orders
  useEffect(() => {
    const fetchOrdersByMonth = async (month) => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/orders?month=${month}`
        );

        const res = response.data.data;
        setOrders(res);
      } catch (error) {
        console.error("Error fetching orders by month:", error);
        return [];
      }
    };

    fetchOrdersByMonth(month);
  }, []);

  // Product Save
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", formState.name);
    formData.append("price", formState.price);

    formData.append("image", image); // single file


    console.log("payload (FormData)", formState.name, formState.price, image);

    let response;
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/products/${editId}`,
          formData,
          { headers }
        );
        toast.success("✅ Product updated successfully");
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/products`,
          formData,
          { headers }
        );
        toast.success("✅ Product added successfully");
      }

      fetchProducts();
      fetchProductsAddMonths();

      // reset form
      setEditFormState({ name: "", price: "" });
      setImage(null);
      setImagePreview(null);
      setIsSliderOpen(false);
      setIsEdit(false);
      setEditId(null);

    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} product failed`);
    }
  };


  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setEditFormState({ ...formState, image: "" });
  };

  const parseCurrency = (value) => {
    if (value == null) return 0;
    return parseFloat(String(value).replace(/[^0-9.]/g, "")) || 0;
  };

  // Capital 1st letter
  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Open the edit modal and populate the form
  const handleEdit = (product) => {
    setIsEdit(true);
    setEditId(product._id);
    setEditFormState({
      name: product.name || "",
      price: product.price || "",
      image: product.image?.[0]?.url || "",
    });
    setImagePreview(product.image?.[0]?.url || "");
    setIsSliderOpen(true);
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <PuffLoader height="150" width="150" radius={1} color="#1d4ed8" />
        </div>
      </div>
    );
  }

  // Calculate analytics data
  const totalConfirmed = orders.filter(
    (o) => o.orderStatus === "Confirmed"
  ).length;
  const totalCanceled = orders.filter(
    (o) => o.orderStatus === "Canceled"
  ).length;
  const totalOrdersCount = orders.length;
  const confirmedPercent =
    totalOrdersCount > 0
      ? Math.round((totalConfirmed / totalOrdersCount) * 100)
      : 0;
  const canceledPercent =
    totalOrdersCount > 0
      ? Math.round((totalCanceled / totalOrdersCount) * 100)
      : 0;
  const totalSales = orders.reduce(
    (sum, order) => sum + (order.totalSales || 0),
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 1.5s infinite;
          }
          .progress-bar-glow {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
          }
        `}
      </style>

      {/* Page Header with Add Product Button and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-newPrimary">
            Manage Products
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your products inventory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none  focus:ring-2 focus:ring-newPrimary focus:border-newPrimary w-full shadow-sm"
              placeholder="Search products..."
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FiX className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <button
            className="bg-newPrimary text-white px-5 py-3 rounded-lg hover:bg-newPrimary/80 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            onClick={handleAddProduct}
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Results count */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Found {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} matching "{searchTerm}"
        </div>
      )}

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 mr-4">
              <FiBarChart2 className="text-newPrimarytext-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {products.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 mr-4">
              <FaRupeeSign className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Sales</p>
              <h3 className="text-2xl font-bold text-gray-800">
                RS {totalSales.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 mr-4">
              <FiTrendingUp className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Confirmed Orders</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {totalConfirmed}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Table and Cards */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product List Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 w-full  overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Product List
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length} items
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <div className="w-full">
              {/* Table Headers */}
              <div className="hidden lg:grid grid-cols-5 gap-4 py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider rounded-lg">
                <div>Name</div>
                <div>Price</div>
                <div>Total Orders</div>
                <div>Total Sales</div>
                {userInfo?.isAdmin && <div className="text-right">Actions</div>}
              </div>

              {/* Product Rows */}
              <div className="mt-4 flex flex-col gap-3 pb-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => {
                    const price = parseCurrency(product.price);
                    const totalOrders = parseCurrency(product.totalOrders);
                    const totalSales = price * totalOrders;

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-5 items-center gap-4 bg-white p-4 rounded-lg shadow-xs hover:shadow-md transition-all border border-gray-100"
                      >
                        {/* Name */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={product.image[0]?.url}
                              alt="Product Icon"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {capitalizeFirstLetter(product.name)}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-sm font-medium text-gray-900">
                          RS {price.toLocaleString()}
                        </div>

                        {/* Orders */}
                        <div className="text-sm text-gray-500">
                          {totalOrders} Orders
                        </div>

                        {/* Sales */}
                        <div className="text-sm font-semibold text-green-600">
                          RS {totalSales.toLocaleString()}
                        </div>

                        {/* Actions */}

                        {userInfo?.isAdmin && (
                          <div className="hidden md:flex justify-end">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <FiEdit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                    <div className="mb-2 text-4xl">📦</div>
                    {searchTerm
                      ? "No products found matching your search"
                      : "No products available"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        
      </div>

      {/* Enhanced Right-Side Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 flex justify-end">
          <div
            ref={sliderRef}
            className="h-full w-full sm:w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold text-newPrimary">
                  {" "}
                  {isEdit ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 text-2xl p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setIsEdit(false);
                    setEditId(null);
                    setEditFormState({ name: "", price: "", image: "" });
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) =>
                        setEditFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">RS </span>
                      </div>
                      <input
                        type="text"
                        value={formState.price}
                        onChange={(e) =>
                          setEditFormState({
                            ...formState,
                            price: e.target.value,
                          })
                        }
                        className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              onChange={handleImageUpload}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Image Preview
                        </h3>
                        <div className="relative group w-full h-48">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity shadow-md"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50">
                <button
                  type="button"
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  onClick={() => {
                    setIsSliderOpen(false);
                    setIsEdit(false);
                    setEditId(null);
                    setEditFormState({ name: "", price: "", image: "" });
                    setImage(null);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-newPrimary hover:bg-newPrimary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-newPrimary transition-colors"
                  onClick={handleSave}
                >
                  {isEdit ? "Update Product" : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
