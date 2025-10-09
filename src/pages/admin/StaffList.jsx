import React, { useState, useCallback, useEffect, useRef } from "react";
import { PuffLoader } from "react-spinners";
import gsap from "gsap";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiX,
} from "react-icons/fi";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formState, setEditFormState] = useState({
    name: "",
    department: "",
    designation: "",
    address: "",
    number: "",
    email: "",
    password: "",
    image: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));


  // Search functionality
  useEffect(() => {
    if (searchQuery) {
      const filtered = staffList.filter(
        (staff) =>
          staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          staff.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaffList(filtered);
    } else {
      setFilteredStaffList(staffList);
    }
  }, [searchQuery, staffList]);

  // slider styling
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { x: "100%", opacity: 0 }, // offscreen right
        {
          x: "0%",
          opacity: 1,
          duration: 1.2,
          ease: "expo.out", // smoother easing
        }
      );
    }
  }, [isSliderOpen]);

  // Fetch data from API
  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/staff`
      );
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const mappedStaff = result.data.map((staff) => ({
          _id: staff._id,
          name: staff.username,
          department: staff.department,
          designation: staff.designation,
          address: staff.address,
          number: staff.number,
          email: staff.email,
          password: staff.password,
          image: staff.image || [],
        }));

        setStaffList(mappedStaff);
        setFilteredStaffList(mappedStaff);
      }
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []); // No dependencies so the function is memoized once

  console.log("Staff List", staffList);

  useEffect(() => {
    fetchStaff(); // Only re-executes if fetchStaff reference changes
  }, [fetchStaff]);

  // Handlers
  const handleAddStaff = () => {
    // Reset fields
    setStaffName("");
    setDepartment("");
    setDesignation("");
    setAddress("");
    setNumber("");
    setEmail("");
    setPassword("");
    setImage(null);
    setImagePreview(null);
    setEditId(null);
    setIsEdit(false);
    setIsSliderOpen(false);

    setIsSliderOpen(true);
  };

  //  Staff saved
  const handleSave = async () => {
    if (!image) {
      toast.error("Image is compulsory");
      return; 
    }
    const formData = new FormData();
    formData.append("username", staffName);
    formData.append("department", department);
    formData.append("designation", designation);
    formData.append("address", address);
    formData.append("number", number);
    formData.append("email", email);
    formData.append("password", password);
    if (image) {
      formData.append("image", image);
    }
    

  

    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo")) || {};
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/staff/${editId}`,
          formData,
          { headers }
        );
        toast.success("✅ Staff updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/staff`,
          formData,
          { headers }
        );
        toast.success("✅ Staff added successfully");
      }

      // Reset fields
      setStaffName("");
      setDepartment("");
      setDesignation("");
      setAddress("");
      setNumber("");
      setEmail("");
      setPassword("");
      setImage(null);
      setImagePreview(null);
      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);

      // Refresh list
      fetchStaff();
    } catch (error) {
      console.error("Save error:", error);

      // ✅ Extract message from backend
      const backendMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(`❌ ${backendMessage}`);
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

  // Image Remove
  const removeImage = () => {
    setImagePreview("");
    setEditFormState({ ...formState, image: "" });
  };

  // Open the edit modal and populate the form
  const handleEdit = (staff) => {
    setIsEdit(true);
    setEditId(staff._id);
    setStaffName(staff.name || "");
    setDepartment(staff.department || "");
    setDesignation(staff.designation || "");
    setAddress(staff.address || "");
    setNumber(staff.number || "");
    setEmail(staff.email || "");
    setPassword(staff.password || "");
    setImagePreview(staff.image?.url || "");
    setImage(null);
    setIsSliderOpen(true);
  };

  // Delete Staff
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2", // gap between buttons
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
            setLoading(true);
            const token = userInfo?.token;
            if (!token) {
              toast.error("Authorization token missing!");
              return;
            }

            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/staff/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Update UI
            setStaffList(staffList.filter((p) => p._id !== id));
            setFilteredStaffList(filteredStaffList.filter((p) => p._id !== id));

            swalWithTailwindButtons.fire(
              "Deleted!",
              "Staff deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete staff.",
              "error"
            );
          } finally {
            setLoading(false);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Staff is safe 🙂",
            "error"
          );
        }
      });
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
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaffList.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredStaffList.length / itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Staff List
          </h1>
          <p className="text-gray-500 text-sm">Manage your staff members</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>
          {userInfo.isAdmin && (
            <button
              onClick={handleAddStaff}
              className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus className="text-lg" />
              <span>Add Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Number</th>
              <th className="py-3 px-4">Email</th>
              {userInfo?.isAdmin && (
                <th className="py-3 px-4 text-right">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {filteredStaffList.length > 0 ? (
              currentStaff.map((staff, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Name with Image */}
                  <td className="py-3 px-4 flex items-center gap-2">
                    <img
                      src={staff.image?.url || "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg"}
                      alt="Staff"
                      className="w-8 h-8 rounded-full border object-cover"
                    />
                    <span className="font-medium text-gray-900">
                      {staff.name
                        ? staff.name.length > 20
                          ? `${staff.name.slice(0, 20)}...`
                          : staff.name
                        : "N/A"}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4 text-gray-700">
                    {staff.department || "N/A"}
                  </td>

                  {/* Address */}
                  <td className="py-3 px-4 text-gray-700">
                    {staff.address
                      ? staff.address.length > 20
                        ? `${staff.address.slice(0, 20)}...`
                        : staff.address
                      : "No have Location"}
                  </td>

                  {/* Number */}
                  <td className="py-3 px-4 text-gray-700">
                    {staff.number || "N/A"}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-gray-700 truncate">
                    {staff.email || "N/A"}
                  </td>

                  {/* Actions */}
                  {userInfo?.isAdmin && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(staff)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(staff._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={userInfo?.isAdmin ? 6 : 5}
                  className="text-center py-6 text-gray-500"
                >
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-full md:w-1/2 lg:w-1/3 bg-white h-full overflow-y-auto shadow-lg"
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Update Staff" : "Add a New Staff"}
              </h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={() => {
                  setIsSliderOpen(false);
                  setIsEdit(false);
                  setEditId(null);
                  setImage(null);
                  setImagePreview(null);
                }}
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Name <span className="text-newPrimary">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter staff name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Department <span className="text-newPrimary">*</span>
                </label>
                <div className="relative">
                  <FiBriefcase className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter department"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Designation <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                  placeholder="Enter designation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Address <span className="text-newPrimary">*</span>
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Number <span className="text-newPrimary">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Email <span className="text-newPrimary">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Password <span className="text-newPrimary">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                  placeholder="Enter password"
                />
              </div>

              {/* Image Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Staff Image <span className="text-newPrimary">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                        className="relative cursor-pointer bg-white rounded-md font-medium text-newPrimary hover:text-newPrimary focus-within:outline-none"
                      >
                        <span>Upload files</span>
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
                      Uploaded Image
                    </h3>
                    <div className="relative group w-48 h-32">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md border border-gray-200"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsSliderOpen(false);
                    setIsEdit(false);
                    setEditId(null);
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-newPrimary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                >
                  {isEdit ? "Update Staff" : "Save Staff"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pagination Controls */}
      {filteredStaffList.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
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

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border text-sm font-medium transition-all duration-200 ${
                currentPage === i + 1
                  ? "bg-newPrimary text-white border-newPrimary shadow-sm"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

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
      )}
    </div>
  );
};

export default StaffList;
