import React, { useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from 'axios'
import { PuffLoader } from "react-spinners";

const CustomerData = () => {
  const [customerData, setCustomerData] = useState([]);
  
  
  const customerList = [
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
    { name: "John Doe", email: "info@gmail.com", designation: "Operator", address: "Johar Town, Lahore.", department: "Academics", assignedStaff: "NaN", assignedProduct: "NaN" },
  ];

  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [persons, setPersons] = useState([{ fullName: "", phone: "", email: "", designation: "", department: "" }]);
  const [assignedStaff, setAssignedStaff] = useState("");
  const [assignedProduct, setAssignedProduct] = useState("");
  const [images, setImages] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const handleAddCustomer = () => {
    setIsSliderOpen(true);
  };


  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clients`);
      const result = await response.json();
      console.log("Clients ", result);
      
      setCustomerData(result);

      
    } catch (error) {
      console.error("Error fetching staff data:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []); // No dependencies so the function is memoized once

  // console.log("Client List", CustomerData);

  useEffect(() => {
    fetchCustomerData(); // Only re-executes if fetchStaff reference changes
  }, [fetchCustomerData]);

  const handleSave = () => {
    console.log("Saving:", { customerEmail, customerPhone, customerAddress, customerCity, companyName, businessType, persons, assignedStaff, assignedProduct, images });
    setIsSliderOpen(false);
    setCustomerEmail("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCustomerCity("");
    setCompanyName("");
    setBusinessType("");
    setPersons([{ fullName: "", phone: "", email: "", designation: "", department: "" }]);
    setAssignedStaff("");
    setAssignedProduct("");
    setImages([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };

  const handleAddPerson = () => {
    setPersons([...persons, { fullName: "", phone: "", email: "", designation: "", department: "" }]);
  };

  const handlePersonChange = (index, field, value) => {
    const newPersons = [...persons];
    newPersons[index][field] = value;
    setPersons(newPersons);
  };

    // Show loading spinner
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <PuffLoader
              height="150"
              width="150"
              radius={1}
              color="#00809D"
            />
          </div>
        </div>
      );
    }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Customer List</h1>
          <p className="text-gray-500 text-sm">Call Logs Dashboard</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
          onClick={handleAddCustomer}
        >
          + Add Customer
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary/10">
                <th className="py-3 px-4 text-left text-gray-900">Name</th>
                <th className="py-3 px-4 text-left text-gray-900">Email</th>
                <th className="py-3 px-4 text-left text-gray-900">Designation</th>
                <th className="py-3 px-4 text-left text-gray-900">Address</th>
                <th className="py-3 px-4 text-left text-gray-900">Department</th>
                <th className="py-3 px-4 text-left text-gray-900">Assign to Staff</th>
                <th className="py-3 px-4 text-left text-gray-900">Assign Product</th>
              </tr>
            </thead>
            <tbody>
              {customerList.map((customer, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-secondary/20 transition-colors duration-150">
                  <td className="py-3 px-4 flex items-center">
                    <img 
                      src="https://via.placeholder.com/40" 
                      alt={`${customer.name}'s profile`} 
                      className="w-10 h-10 rounded-full mr-2" 
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = "https://www.gravatar.com/avatar/?d=mp"; 
                      }} 
                    />
                    {customer.name || "N/A"}
                  </td>
                  <td className="py-3 px-4">{customer.email || "N/A"}</td>
                  <td className="py-3 px-4">{customer.designation || "N/A"}</td>
                  <td className="py-3 px-4">{customer.address || "N/A"}</td>
                  <td className="py-3 px-4">{customer.department || "N/A"}</td>
                  <td className="py-3 px-4">{customer.assignedStaff || "N/A"}</td>
                  <td className="py-3 px-4">{customer.assignedProduct || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Modal/Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">Add Client</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
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
                    <label className="block text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter phone number"
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
                    <label className="block text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Business Type</label>
                    <input
                      type="text"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Enter business type"
                    />
                  </div>
                </div>
              </div>

              {/* Person Section */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Person</h3>
                  <button
                    className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                    onClick={handleAddPerson}
                  >
                    + Add New Person
                  </button>
                </div>
                {persons.map((person, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 last:mb-0">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={person.fullName}
                        onChange={(e) => handlePersonChange(index, "fullName", e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={person.phone}
                        onChange={(e) => handlePersonChange(index, "phone", e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={person.email}
                        onChange={(e) => handlePersonChange(index, "email", e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Designation</label>
                      <input
                        type="text"
                        value={person.designation}
                        onChange={(e) => handlePersonChange(index, "designation", e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                        placeholder="Enter designation"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={person.department}
                        onChange={(e) => handlePersonChange(index, "department", e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                        placeholder="Enter department"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Assign Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Assign</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Assign to Staff</label>
                    <input
                      type="text"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Select staff"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">Assign Product</label>
                    <input
                      type="text"
                      value={assignedProduct}
                      onChange={(e) => setAssignedProduct(e.target.value)}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
                      placeholder="Select product"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Upload Images</h3>
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-newPrimary file:text-white
                    hover:file:bg-primaryDark
                    file:transition-colors file:duration-200"
                />
                {images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {images.map((img, index) => (
                      <img key={index} src={img} alt={`Upload ${index}`} className="w-20 h-20 object-cover rounded" />
                    ))}
                  </div>
                )}
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
                  Save Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerData;