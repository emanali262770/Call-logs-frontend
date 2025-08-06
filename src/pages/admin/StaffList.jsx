import React, { useState, useEffect } from "react";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [address, setAddress] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState([]);

  // Fetch data from API
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch("https://call-logs-backend.vercel.app/api/staff");
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          // Map API data to match table structure, using username as name
          const mappedStaff = result.data.map(staff => ({
            name: staff.username,
            department: staff.department,
            designation: staff.designation,
            address: staff.address,
            number: staff.number,
            email: staff.email,
          }));
          setStaffList(mappedStaff);
        }
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };
    fetchStaff();
  }, []);

  // Handlers
  const handleAddStaff = () => {
    setIsSliderOpen(true);
  };

  const handleSave = () => {
    // Placeholder for save logic
    console.log("Saving:", { staffName, department, designation, address, number, email, images });
    setIsSliderOpen(false);
    setStaffName("");
    setDepartment("");
    setDesignation("");
    setAddress("");
    setNumber("");
    setEmail("");
    setImages([]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files.map(file => URL.createObjectURL(file)));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-newPrimary">Staff List</h1>
          <p className="text-gray-500 text-sm">Call Logs Dashboard</p>
        </div>
        <button
          className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark"
          onClick={handleAddStaff}
        >
          + Add Staff
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-secondary/10">
                <th className="py-3 px-4 text-left text-newPrimary">Name</th>
                <th className="py-3 px-4 text-left text-newPrimary">Department</th>
                <th className="py-3 px-4 text-left text-newPrimary">Designation</th>
                <th className="py-3 px-4 text-left text-newPrimary">Address</th>
                <th className="py-3 px-4 text-left text-newPrimary">Number</th>
                <th className="py-3 px-4 text-left text-newPrimary">Email</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-secondary/20">
                  <td className="py-3 px-4 flex items-center">
                    <img src="https://via.placeholder.com/40" alt={`${staff.name}'s profile`} className="w-10 h-10 rounded-full mr-2" onError={(e) => { e.target.style.display = 'none'; }} />
                    {staff.name || "N/A"}
                  </td>
                  <td className="py-3 px-4">{staff.department || "N/A"}</td>
                  <td className="py-3 px-4">{staff.designation || "N/A"}</td>
                  <td className="py-3 px-4">{staff.address || "N/A"}</td>
                  <td className="py-3 px-4">{staff.number || "N/A"}</td>
                  <td className="py-3 px-4">{staff.email || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div className="w-1/3 bg-white p-6 h-full overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-newPrimary">Add a New Staff</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsSliderOpen(false)}
              >
                ×
              </button>
            </div>
            <div>
              <div className="mb-4">
                <div className="flex justify-center mb-2">
                  <button
                    onClick={() => document.getElementById("imageUpload").click()}
                    className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl text-gray-600 hover:bg-gray-300 transition-colors duration-200"
                  >
                    📷
                  </button>
                  <input
                    id="imageUpload"
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Number</label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Staff Image</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt={`Uploaded ${idx}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <button
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-900 w-full"
                onClick={handleSave}
              >
                Save Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;