import React, { useState, useEffect } from "react";

// Placeholder for authentication token (replace with your actual token)
const AUTH_TOKEN = "your-auth-token-here"; // Replace with the actual token from your auth system

const CustomerData = () => {
  const [customerList, setCustomerList] = useState([]);
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch clients data (public endpoint)
        const clientsResponse = await fetch("https://call-logs-backend.vercel.app/api/clients");
        if (!clientsResponse.ok) {
          throw new Error(`Failed to fetch clients data: ${clientsResponse.status}`);
        }
        const clientsData = await clientsResponse.json();

        // Fetch assigned data (protected endpoint with auth)
        const assignedResponse = await fetch("https://call-logs-backend.vercel.app/api/clients/assigned", {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`, // Add authentication token
          },
        });
        const assignedData = assignedResponse.ok
          ? await assignedResponse.json()
          : { data: [] }; // Fallback to empty array if auth fails

        // Log raw data for debugging
        console.log("Clients Data:", clientsData);
        console.log("Assigned Data:", assignedData);

        // Combine and map data
        const allClients = [...(clientsData || []), ...(assignedData.data || [])];
        const mappedData = allClients.flatMap(client =>
          client.persons.map(person => ({
            name: person.name || "N/A",
            email: person.email || "N/A",
            designation: person.designation || "N/A",
            address: `${client.address || "N/A"}, ${client.city || "N/A"}`,
            department: person.department || "N/A",
            assignedStaff: client.assignToStaffId?.name || "N/A",
            assignedProduct: client.assignToProductId?.name || "N/A",
            companyLogo: client.companyLogo?.url || "https://www.gravatar.com/avatar/?d=mp",
          }))
        );

        // Log mapped data for debugging
        console.log("Mapped Data:", mappedData);

        setCustomerList(mappedData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleAddCustomer = () => {
    setIsSliderOpen(true);
  };

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
        {isLoading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {!isLoading && !error && customerList.length === 0 && (
          <p className="text-center text-gray-600">No data available</p>
        )}
        {!isLoading && !error && customerList.length > 0 && (
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
                        src={customer.companyLogo}
                        alt={`${customer.name}'s profile`}
                        className="w-10 h-10 rounded-full mr-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://www.gravatar.com/avatar/?d=mp";
                        }}
                      />
                      {customer.name}
                    </td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{customer.designation}</td>
                    <td className="py-3 px-4">{customer.address}</td>
                    <td className="py-3 px-4">{customer.department}</td>
                    <td className="py-3 px-4">{customer.assignedStaff}</td>
                    <td className="py-3 px-4">{customer.assignedProduct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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