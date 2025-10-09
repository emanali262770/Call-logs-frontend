import React, { useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUser,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiMail,
} from "react-icons/fi";

const CustomerData = () => {
  const [customerList, setCustomerData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
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

  const handleAddCustomer = () => {
     // Reset form
      setCustomerEmail("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerCity("");
      setCompanyName("");
      setBusinessType("");
      setPersons([
        { fullName: "", phone: "", email: "", designation: "", department: "" },
      ]);
      setAssignedStaff("");
      setAssignedProduct("");
      setImage(null);
      setImagePreview(null);
      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);
    setIsSliderOpen(true);
    
  };

  // Token
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

  // Fetch Customer Data
  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/customers`
      );
      const result = await response.json();
      setCustomerData(result.data || []);
      setFilteredCustomers(result.data || []);
      console.log({ data: result.data });
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // Search functionality
 useEffect(() => {
  if (searchQuery.trim() === "") {
    setFilteredCustomers(customerList);
  } else {
    const query = searchQuery.toLowerCase();

    const filtered = customerList.filter((customer) => {
      return (
        customer.companyName?.toLowerCase().includes(query) ||
        customer.email?.toLowerCase().includes(query) ||
        customer.phoneNumber?.toLowerCase().includes(query) || 
        customer.address?.toLowerCase().includes(query) ||
        customer.city?.toLowerCase().includes(query) ||
        customer.businessType?.toLowerCase().includes(query) ||
        customer.persons?.some(
          (person) =>
            person.fullName?.toLowerCase().includes(query) ||
            person.designation?.toLowerCase().includes(query) ||
            person.department?.toLowerCase().includes(query)
        ) ||
        (customer.assignedStaff &&
          typeof customer.assignedStaff === "object" &&
          customer.assignedStaff.username
            ?.toLowerCase()
            .includes(query)) ||
        (customer.assignedProducts &&
          typeof customer.assignedProducts === "object" &&
          customer.assignedProducts.name?.toLowerCase().includes(query))
      );
    });

    setFilteredCustomers(filtered);
  }
}, [searchQuery, customerList]);


  // Fetch Staff and Product Data
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
      console.log("productRes ", product.data);
      
    } catch (error) {
      console.error("Error fetching assigned data:", error);
      toast.error("Failed to fetch staff/product data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignedData();
  }, [fetchAssignedData]);

  // Save Customer Data
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("businessType", businessType);
    formData.append("companyName", companyName);
    formData.append("address", customerAddress);
    formData.append("city", customerCity);
    formData.append("email", customerEmail);
    formData.append("phoneNumber", customerPhone);

    if (image) formData.append("companyLogo", image);

    persons.forEach((person, index) => {
      formData.append(`persons[${index}][fullName]`, person.fullName);
      formData.append(`persons[${index}][designation]`, person.designation);
      formData.append(`persons[${index}][department]`, person.department);
      formData.append(`persons[${index}][phoneNumber]`, person.phone);
      formData.append(`persons[${index}][email]`, person.email);
    });

    formData.append("assignedStaff", assignedStaff);
    formData.append("assignedProducts", assignedProduct);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/customers/${editId}`,
          formData,
          { headers }
        );
        toast.success("Customer updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/customers`,
          formData,
          { headers }
        );
        toast.success("Customer added successfully");
      }

      // Reset form
      setCustomerEmail("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCustomerCity("");
      setCompanyName("");
      setBusinessType("");
      setPersons([
        { fullName: "", phone: "", email: "", designation: "", department: "" },
      ]);
      setAssignedStaff("");
      setAssignedProduct("");
      setImage(null);
      setImagePreview(null);
      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);

      fetchCustomerData();
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove Image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Add Person
  const handleAddPerson = () => {
    setPersons([
      ...persons,
      { fullName: "", phone: "", email: "", designation: "", department: "" },
    ]);
  };

  // Update Person
  const handlePersonChange = (index, field, value) => {
    const newPersons = [...persons];
    newPersons[index][field] = value;
    setPersons(newPersons);
  };

  // Edit Customer
  const handleEdit = (client) => {

    
    setIsEdit(true);
    setEditId(client._id);

    setCustomerEmail(client.email || "");
    setCustomerPhone(client.phoneNumber || "");
    setCustomerAddress(client.address || "");
    setCustomerCity(client.city || "");
    setCompanyName(client.companyName || "");
    setBusinessType(client.businessType || "");

    setPersons(
      client.persons?.map((person) => ({
        fullName: person.fullName || "",
        phone: person.phoneNumber || "",
        email: person.email || "",
        designation: person.designation || "",
        department: person.department || "",
      })) || [
        { fullName: "", phone: "", email: "", designation: "", department: "" },
      ]
    );

    setAssignedStaff(
      typeof client.assignedStaff === "object"
        ? client.assignedStaff?._id || ""
        : client.assignedStaff || ""
    );

    setAssignedProduct(
      typeof client.assignedProducts === "object"
        ? client.assignedProducts?._id || ""
        : client.assignedProducts || ""
    );

    if (client.companyLogo?.url) {
      setImagePreview(client.companyLogo.url);
      setImage(null);
    } else {
      setImagePreview(null);
      setImage(null);
    }

    setIsSliderOpen(true);
  };

  // Delete Customer
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
              `${import.meta.env.VITE_API_BASE_URL}/customers/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setCustomerData(customerList.filter((p) => p._id !== id));
            setFilteredCustomers(filteredCustomers.filter((p) => p._id !== id));

            swalWithTailwindButtons.fire(
              "Deleted!",
              "Customer deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete Customer.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Customer is safe 🙂",
            "error"
          );
        }
      });
  };

  // Pagination Logic
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);


  // Loading Spinner
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Customer List
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
       {
        userInfo?.isAdmin&& (
             <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
            onClick={handleAddCustomer}
          >
            <FiPlus className="text-lg" />
            <span>Add Customer</span>
          </button>
        )
       }
        
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-8 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Name</div>
              <div>Email</div>
              <div>Designation</div>
              <div>Address</div>
              <div>Department</div>
              <div>Assigned Staff</div>
              <div>Assigned Product</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {currentItems.map((client, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-8 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  {/* Mobile view header */}
                  <div className="md:hidden flex justify-between items-center border-b pb-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-[#f0d694] rounded-full">
                        <img
                          src={
                            client.companyLogo?.url ||
                            "https://via.placeholder.com/40"
                          }
                          alt="Company Logo"
                          className="w-7 h-7 object-cover rounded-full"
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.companyName}
                      </div>
                    </div>
                    {userInfo?.isAdmin && (
                      <div className="text-right relative group">
                        <button className="text-gray-400 hover:text-gray-600 text-xl">
                          ⋯
                        </button>
                        <div className="absolute right-0 top-6 w-28 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300 z-50 flex flex-col">
                          <button
                            onClick={() => handleEdit(client)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-blue-100 text-blue-600 flex items-center gap-2"
                          >
                            <FiEdit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 text-red-500 flex items-center gap-2"
                          >
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Desktop view cells */}
                  <div className="hidden md:flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center border rounded-full">
                      <img
                        src={
                          client.companyLogo?.url ||
                          "https://via.placeholder.com/40"
                        }
                        alt="Company Logo"
                        className="w-7 h-7 object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {client.companyName}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center text-sm text-green-600 truncate">
                    <FiMail className="mr-2 text-gray-400" size={14} />
                    {client.email || "N/A"}
                  </div>
                  <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                    <FiBriefcase className="mr-2 text-gray-400" size={14} />
                    {client.persons?.[0]?.designation || "N/A"}
                  </div>
                  <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                    <FiMapPin className="mr-2 text-gray-400" size={14} />
                    {client.address || "N/A"}
                  </div>
                  <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                    <FiUser className="mr-2 text-gray-400" size={14} />
                    {client.persons?.[0]?.department || "N/A"}
                  </div>
                  <div className="hidden md:flex items-center  text-sm text-gray-500 ">
                    <FiUser className="mr-2 text-gray-400" size={14} />
                    {client?.assignedStaff?.username || "N/A"}
                  </div>
                  <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                    <FiBriefcase className="mr-2 text-gray-400" size={14} />
                    {client?.assignedProducts?.name|| "N/A"}
                  </div>

                  {/* Mobile view content */}
                  <div className="md:hidden grid grid-cols-2 gap-2 mt-2">
                    <div className="text-xs text-gray-500">Email:</div>
                    <div className="text-sm flex items-center">
                      <FiMail className="mr-1 text-gray-400" size={14} />
                      {client.email || "N/A"}
                    </div>

                    <div className="text-xs text-gray-500">Designation:</div>
                    <div className="text-sm flex items-center">
                      <FiBriefcase className="mr-1 text-gray-400" size={14} />
                      {client.persons?.[0]?.designation || "N/A"}
                    </div>

                    <div className="text-xs text-gray-500">Address:</div>
                    <div className="text-sm flex items-center">
                      <FiMapPin className="mr-1 text-gray-400" size={14} />
                      {client.address || "N/A"}
                    </div>

                    <div className="text-xs text-gray-500">Department:</div>
                    <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                      <FiUser className="mr-2 text-gray-400" size={14} />
                      {client.persons?.[0]?.department || "N/A"}
                    </div>

                    <div className="text-xs text-gray-500">Assigned Staff:</div>
                    <div className="text-sm flex items-center">
                      <FiUser className="mr-1 text-gray-400" size={14} />
                    {client?.assignedStaff?.username|| "N/A"}
                    </div>

                    <div className="text-xs text-gray-500">
                      Assigned Product:
                    </div>
                    <div className="text-sm flex items-center">
                      <FiBriefcase className="mr-1 text-gray-400" size={14} />
                      {client?.assignedProducts?.name|| "N/A"}
                    </div>
                  </div>

                  {/* Actions - visible on desktop only (mobile actions are in header) */}
                  {userInfo?.isAdmin && (
                    <div className="hidden md:flex justify-end">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(client)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(client._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {filteredCustomers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? "No customers found matching your search"
                    : "No customers available"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">
                {isEdit ? "Edit Client" : "Add Client"}
              </h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={() => setIsSliderOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Customer</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Business Type
                    </label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter business type"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>

                  {/* Company Logo Upload */}
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Company Logo Upload
                    </h3>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-newPrimary file:text-white
                        hover:file:bg-primaryDark
                        file:transition-colors file:duration-200"
                    />
                    {imagePreview && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">
                          Company Logo Preview
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
                </div>
              </div>

              {/* Person Section */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Person</h3>
                  <button
                    className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200 flex items-center gap-2"
                    onClick={handleAddPerson}
                  >
                    <FiPlus /> Add New Person
                  </button>
                </div>
                {persons.map((person, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-200 rounded-lg p-4 mb-6 last:mb-0"
                  >
                    {/* Cancel Button for Each Person */}
                    {index > 0 && (
                      <button
                        onClick={() =>
                          setPersons(persons.filter((_, i) => i !== index))
                        }
                        className="absolute top-2 right-2 text-sm text-red-600 border border-red-500 px-2 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                      >
                        Cancel
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={person.fullName}
                          onChange={(e) =>
                            handlePersonChange(
                              index,
                              "fullName",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">
                          Designation
                        </label>
                        <input
                          type="text"
                          value={person.designation}
                          onChange={(e) =>
                            handlePersonChange(
                              index,
                              "designation",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                          placeholder="Enter designation"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={person.department}
                          onChange={(e) =>
                            handlePersonChange(
                              index,
                              "department",
                              e.target.value
                            )
                          }
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                          placeholder="Enter department"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={person.phone}
                          onChange={(e) =>
                            handlePersonChange(index, "phone", e.target.value)
                          }
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={person.email}
                          onChange={(e) =>
                            handlePersonChange(index, "email", e.target.value)
                          }
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assign Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Assign</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Assign to Staff
                    </label>
                    <select
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
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
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
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
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setIsSliderOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-newPrimary text-white px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                  onClick={handleSave}
                >
                  {isEdit ? "Update Client" : "Save Client"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Pagination Controls */}
{filteredCustomers.length > itemsPerPage && (
  <div className="flex justify-center items-center gap-2 mt-6">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      className={`px-4 py-2 border rounded-lg ${
        currentPage === 1
          ? "text-gray-400 border-gray-200 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 rounded-md border ${
          currentPage === i + 1
            ? "bg-newPrimary text-white border-newPrimary"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
      }
      className={`px-4 py-2 border rounded-lg ${
        currentPage === totalPages
          ? "text-gray-400 border-gray-200 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default CustomerData;
