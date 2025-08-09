import React, { useState, useEffect, useCallback } from "react";
import { PuffLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMeeting = () => {
  // State for the modal
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  const [companyName, setCompanyName] = useState("");
  const [personName, setPersonName] = useState("");
  const [designation, setDesignation] = useState("");
  const [products, setProducts] = useState("");
  const [followUpStatus, setFollowUpStatus] = useState("Follow Up Required");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("Tue 29 Jul, 2025");
  const [nextFollowUpTime, setNextFollowUpTime] = useState("11:00 am");
  const [nextVisitDetails, setNextVisitDetails] = useState("");
  const [detailsOption, setDetailsOption] = useState("Send Profile");
  const [referenceProvidedBy, setReferenceProvidedBy] = useState("");
  const [referToStaff, setReferToStaff] = useState("");
  const [contactMethod, setContactMethod] = useState("By Visit");

  // Fetch Customer Data
  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }
      const result = await response.json();
      setCustomerList(result);
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Failed to load client data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  // Handle opening the modal
  const handleAddClick = () => {
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate saving data
    setTimeout(() => {
      toast.success("Meeting added successfully!");
      setShowModal(false);
      setLoading(false);
    }, 1000);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    // Reset form fields
    setCompanyName("");
    setPersonName("");
    setDesignation("");
    setProducts("");
    setFollowUpStatus("Follow Up Required");
    setNextFollowUpDate("Tue 29 Jul, 2025");
    setNextFollowUpTime("11:00 am");
    setNextVisitDetails("");
    setDetailsOption("Send Profile");
    setReferenceProvidedBy("");
    setReferToStaff("");
    setContactMethod("By Visit");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <PuffLoader color="#00c7fc" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meetings</h1>
        <button
          onClick={handleAddClick}
          className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-purple-700 transition-all"
        >
          <span className="text-xl">+</span>
          <span>Add Meeting</span>
        </button>
      </div>

      {/* Modal for Add Meeting */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[1400px] flex flex-col max-h-800px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Add Meeting</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Company Name and Person */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Company Name</label>
                  <select
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  >
                    <option value="">Select Company</option>
                    {customerList.map((client) => (
                      <option key={client._id} value={client.companyName}>
                        {client.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Person</label>
                  <select
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Person name</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                  </select>
                </div>
              </div>

              {/* Rest of your form remains the same */}
              {/* Designation and Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Operator"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Products</label>
                  <select
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select</option>
                    <option value="Product 1">Product 1</option>
                    <option value="Product 2">Product 2</option>
                  </select>
                </div>
              </div>

              {/* Follow Up Status */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Details</label>
                <div className="flex flex-wrap space-x-4">
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Follow Up Required"
                      checked={followUpStatus === "Follow Up Required"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2"
                    />
                    Follow Up Required
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Not Interested"
                      checked={followUpStatus === "Not Interested"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2"
                    />
                    Not Interested
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="All Ready Installed"
                      checked={followUpStatus === "All Ready Installed"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2"
                    />
                    All Ready Installed
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Phone Number Responding"
                      checked={followUpStatus === "Phone Number Responding"}
                      onChange={(e) => setFollowUpStatus(e.target.value)}
                      className="mr-2"
                    />
                    Phone Number Responding
                  </label>
                </div>
              </div>

              {/* Followup and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Next Followup</label>
                  <select
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Tue 29 Jul, 2025">Tue 29 Jul, 2025</option>
                    <option value="Wed 30 Jul, 2025">Wed 30 Jul, 2025</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Time</label>
                  <select
                    value={nextFollowUpTime}
                    onChange={(e) => setNextFollowUpTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="11:00 am">11:00 am</option>
                    <option value="12:00 pm">12:00 pm</option>
                  </select>
                </div>
              </div>

              {/* Next Visit Details */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Next Visit Details</label>
                <input
                  type="text"
                  value={nextVisitDetails}
                  onChange={(e) => setNextVisitDetails(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="Write here..."
                />
              </div>

              {/* Details Options */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Details</label>
                <div className="flex flex-wrap space-x-4">
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Send Profile"
                      checked={detailsOption === "Send Profile"}
                      onChange={(e) => setDetailsOption(e.target.value)}
                      className="mr-2"
                    />
                    Send Profile
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Send Quotation"
                      checked={detailsOption === "Send Quotation"}
                      onChange={(e) => setDetailsOption(e.target.value)}
                      className="mr-2"
                    />
                    Send Quotation
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Product Information"
                      checked={detailsOption === "Product Information"}
                      onChange={(e) => setDetailsOption(e.target.value)}
                      className="mr-2"
                    />
                    Product Information
                  </label>
                  <label className="flex items-center mb-2">
                    <input
                      type="radio"
                      value="Require Visit/Meeting"
                      checked={detailsOption === "Require Visit/Meeting"}
                      onChange={(e) => setDetailsOption(e.target.value)}
                      className="mr-2"
                    />
                    Require Visit/Meeting
                  </label>
                </div>
              </div>

              {/* Reference Provided By and Refer To Staff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Reference Provided By</label>
                  <select
                    value={referenceProvidedBy}
                    onChange={(e) => setReferenceProvidedBy(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select Reference</option>
                    <option value="Ref A">Ref A</option>
                    <option value="Ref B">Ref B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Refer To Staff</label>
                  <select
                    value={referToStaff}
                    onChange={(e) => setReferToStaff(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="">Select Staff</option>
                    <option value="Staff A">Staff A</option>
                    <option value="Staff B">Staff B</option>
                  </select>
                </div>
              </div>

              {/* Contact Method */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Contact Method</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="By Visit"
                      checked={contactMethod === "By Visit"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="mr-2"
                    />
                    By Visit
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="By Phone"
                      checked={contactMethod === "By Phone"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="mr-2"
                    />
                    By Phone
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="By Email"
                      checked={contactMethod === "By Email"}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="mr-2"
                    />
                    By Email
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-1/4 mx-auto bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition-all mt-4 block"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddMeeting;