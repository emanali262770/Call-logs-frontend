import React, { useState } from "react";
import {
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiX,
} from "react-icons/fi";
import { useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye } from "lucide-react";
import FollowUpViewModal from "./FollowUpViewModal";

const FollowUp = () => {
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedViewData, setSelectedViewData] = useState(null);
  const [followUpList, setFollowUpList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerDescription, setCustomerDescription] = useState("");
  const [date, setDate] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [nextFollowUpTime, setNextFollowUpTime] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Active");
  const [ViewModalDatashow, setViewModalDataShow] = useState([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState(null);
   const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const filteredFollowUps = followUpList.filter((followUp) => {
    const query = searchQuery.toLowerCase();
    return (
      followUp.customerName?.toLowerCase().includes(query) ||
      followUp.customerNumber?.toLowerCase().includes(query) ||
      followUp.customerDescription?.toLowerCase().includes(query) ||
      followUp.status?.toLowerCase().includes(query)
    );
  });

  function convertTo24HourFormat(timeStr) {
    if (!timeStr) return "";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const fetchFollowUpData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/meetings`
      );

      setViewModalDataShow(response.data.data);
      const mappedData = response.data.data.map((item) => ({
        id: item._id,
        customerName: item.companyName || "N/A",
        customerNumber: item?.person?.persons?.[0]?.phoneNumber || "N/A",
        customerDescription: item.details?.[0] || "N/A",
        date:
          item.followDates?.length > 0
            ? new Date(item.followDates[0]).toISOString().split("T")[0]
            : "N/A",
        time: convertTo24HourFormat(item.followTimes?.[0]),
        status: item.status || "N/A",
        timeline: item.Timeline,
      }));

      setFollowUpList(mappedData);

      console.log(response.data.data, "meet");
    } catch (error) {
      console.error("Error fetching meetings data:", error);
      toast.error("Failed to load meetings data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowUpData();
  }, [fetchFollowUpData]);

  console.log({ ViewModalDatashow });

  const handleEditClick = (followUp) => {
    console.log(followUp);

    setSelectedFollowUp(followUp);
    setCustomerName(followUp.customerName);
    setCustomerNumber(followUp.customerNumber);
    setCustomerDescription(followUp.customerDescription);
    setDate(followUp.date);
    setTime(convertTo24HourFormat(followUp.time));
    setStatus(followUp.timeline);
    setIsSliderOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      setLoading(true);
 const headers = {
        Authorization: `Bearer ${userInfo?.token}`,
      };
      // call delete endpoint
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/meetings/${id}`,{headers});

      // update local state instantly
      setFollowUpList((prev) => prev.filter((item) => item.id !== id));
   fetchFollowUpData()
      toast.success("Follow-up deleted successfully!");
    } catch (error) {
      console.error("Error deleting follow-up:", error);
      toast.error("Failed to delete follow-up");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (selectedFollowUp) {
      try {
        const formattedTime = (() => {
          if (!nextFollowUpTime) return "";
          const [hours, minutes] = nextFollowUpTime.split(":");
          let suffix = "AM";
          let hr = parseInt(hours, 10);
          if (hr >= 12) {
            suffix = "PM";
            if (hr > 12) hr -= 12;
          } else if (hr === 0) {
            hr = 12;
          }
          return `${hr}:${minutes} ${suffix}`;
        })();

        // Prepare payload as per your backend
        const payload = {
          date: nextFollowUpDate,
          time: formattedTime,
          detail: customerDescription,
          timeline: status,
        };
        console.log({ payload });

        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/meetings/${
            selectedFollowUp.id
          }/followup`,
          payload
        );

        // update local state instantly
        setFollowUpList((prev) =>
          prev.map((item) =>
            item.id === selectedFollowUp.id
              ? {
                  ...item,
                  date: nextFollowUpDate,
                  time: formattedTime,
                  customerDescription,
                }
              : item
          )
        );
        await fetchFollowUpData();
        toast.success("Follow-up updated successfully!");
      } catch (error) {
        console.error("Error updating follow-up:", error);
        toast.error("Failed to update follow-up");
      }
    }

    // close modal and reset states
    setIsSliderOpen(false);
    setSelectedFollowUp(null);
    setNextFollowUpDate("");
    setNextFollowUpTime("");
    setCustomerDescription("");
  };

  const handleCloseModal = () => {
    setIsSliderOpen(false);
    setSelectedFollowUp(null);
    setCustomerName("");
    setCustomerNumber("");
    setCustomerDescription("");
    setDate("");
    setTime("");
    setStatus("Active");
  };


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Follow Up
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your customer follow-ups
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search follow-ups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>

          {/* <button
            onClick={handleAddFollowUp}
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            <span>Add Follow Up</span>
          </button> */}
        </div>
      </div>

      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-7 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Company Name</div>
              <div>Number</div>
              <div>Description</div>
              <div>Date</div>
              <div>Time</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {filteredFollowUps.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
                  No follow-ups found.
                </div>
              ) : (
                filteredFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="grid grid-cols-1 md:grid-cols-7 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    {/* Mobile view header */}
                    <div className="md:hidden flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {followUp.customerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            followUp.status === "Follow Up Required"
                              ? "bg-yellow-100 text-yellow-800"
                              : followUp.status === "Not Interested"
                              ? "bg-red-100 text-red-800"
                              : followUp.status === "All Ready Installed"
                              ? "bg-green-100 text-green-800"
                              : followUp.status === "Phone Number Responding"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {followUp.status}
                        </span>
                      </div>
                    </div>

                    {/* Desktop view */}
                    <div className="hidden md:flex items-center text-sm font-medium text-gray-900 truncate">
                      <FiUser className="mr-2 text-gray-400" />
                      {followUp.customerName}
                    </div>
                    <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                      <FiPhone className="mr-2 text-gray-400" />
                      {followUp.customerNumber}
                    </div>
                    <div className="hidden md:block text-sm text-gray-500 truncate">
                      {followUp.customerDescription}
                    </div>
                    <div className="hidden md:flex items-center text-sm text-gray-500">
                      <FiCalendar className="mr-2 text-gray-400" />
                      {followUp.date}
                    </div>
                    <div className="hidden md:flex items-center text-sm text-gray-500">
                      <FiClock className="mr-2 text-gray-400" />
                      {new Date(
                        `1970-01-01T${followUp.time}`
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                    <div className="hidden md:block">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          followUp.status === "Follow Up Required"
                            ? "bg-yellow-100 text-yellow-800"
                            : followUp.status === "Not Interested"
                            ? "bg-red-100 text-red-800"
                            : followUp.status === "All Ready Installed"
                            ? "bg-green-100 text-green-800"
                            : followUp.status === "Phone Number Responding"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {followUp.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end md:justify-end col-span-1 md:col-span-1 mt-2 md:mt-0">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(followUp)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(followUp.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const found = ViewModalDatashow.find(
                              (d) => d._id === followUp.id
                            );
                            if (found) {
                              setSelectedViewData(found);
                              setIsView(true);
                            }
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* view modal */}
      {isView && selectedViewData && (
        <FollowUpViewModal
          data={selectedViewData}
          onClose={() => setIsView(false)}
        />
      )}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-white h-full overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">
                {selectedFollowUp ? "Edit Follow Up" : "Add Follow Up"}
              </h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      readOnly
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="time"
                      value={time}
                      readOnly
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Customer Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter customer name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Customer Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter customer number"
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-newPrimary mb-3">
                  Next Follow Up
                </h1>

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="date"
                          value={nextFollowUpDate}
                          onChange={(e) => setNextFollowUpDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-1">
                        Time
                      </label>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="time"
                          value={nextFollowUpTime}
                          onChange={(e) => setNextFollowUpTime(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Customer Remarks
                  </label>
                  <textarea
                    value={customerDescription}
                    onChange={(e) => setCustomerDescription(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter description"
                    rows="3"
                  />
                </div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                >
                  <option value="Active">Active</option>
                  <option value="Hold">Hold</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-newPrimary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                >
                  {selectedFollowUp ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FollowUp;
