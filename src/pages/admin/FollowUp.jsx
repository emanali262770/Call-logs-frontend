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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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
    const headers = {
      Authorization: `Bearer ${userInfo?.token}`,
    };
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/meetings/follow-date`,
        { headers }
      );

      console.log("response ", response.data);

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
    setSelectedFollowUp(followUp);
    setCustomerName(followUp.customerName);
    setCustomerNumber(followUp.customerNumber);
    setCustomerDescription(followUp.customerDescription);
    setDate(followUp.date);
    setTime(convertTo24HourFormat(followUp.time));
    setStatus(followUp.timeline);
    setIsSliderOpen(true);
  };
  const headers = {
    Authorization: `Bearer ${userInfo?.token}`,
  };
  const handleDeleteClick = async (id) => {
    try {
      setLoading(true);

      // call delete endpoint
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/meetings/${id}`,
        { headers }
      );

      // update local state instantly
      setFollowUpList((prev) => prev.filter((item) => item.id !== id));
      fetchFollowUpData();
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
        console.log({ headers });

        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/meetings/${
            selectedFollowUp.id
          }/followup`,
          payload, // 🟢 This is your request body
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
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
        console.error("Save error:", error);

        // ✅ Extract message from backend
        const backendMessage =
          error.response?.data?.message ||
          "Something went wrong. Please try again.";

        toast.error(`❌ ${backendMessage}`);
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
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFollowUps = filteredFollowUps.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredFollowUps.length / itemsPerPage);

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
        </div>
      </div>

      {/* Follow-Up Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-4 w-[60px]">Sr</th>
              <th className="py-3 px-4 w-[200px]">Company Name</th>
              <th className="py-3 px-4 w-[150px]">Number</th>
              <th className="py-3 px-4 w-[250px]">Description</th>
              <th className="py-3 px-4 w-[130px]">Date</th>
              <th className="py-3 px-4 w-[100px]">Time</th>
              <th className="py-3 px-4 w-[180px]">Status</th>
              <th className="py-3 px-4 text-right w-[120px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredFollowUps.length === 0 ? (
              <tr>
                <td
                  colSpan={userInfo?.isAdmin ? 8 : 7}
                  className="text-center py-8 text-gray-500"
                >
                  No follow-ups found.
                </td>
              </tr>
            ) : (
              currentFollowUps.map((followUp, index) => (
                <tr
                  key={followUp.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {indexOfFirstItem + index + 1}
                  </td>

                  {/* Company Name */}
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {followUp.customerName?.length > 17
                        ? `${followUp.customerName.slice(0, 17)}...`
                        : followUp.customerName || "N/A"}
                    </div>
                  </td>

                  {/* Number */}
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      {followUp.customerNumber || "N/A"}
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3 px-4 truncate">
                    {followUp.customerDescription?.length > 25
                      ? `${followUp.customerDescription.slice(0, 25)}...`
                      : followUp.customerDescription || "—"}
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {followUp.date || "—"}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      {followUp.time
                        ? new Date(
                            `1970-01-01T${followUp.time}`
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "—"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
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
                      {followUp.status || "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditClick(followUp)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                      >
                        <FiEdit size={16} />
                      </button>
                      {userInfo?.isAdmin && (
                        <button
                          onClick={() => handleDeleteClick(followUp.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
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
                        className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all 
    ${selectedFollowUp ? "text-gray-500 bg-gray-100 cursor-not-allowed" : ""}`}
                      readOnly={selectedFollowUp}
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
                      onChange={(e) => setTime(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all 
    ${selectedFollowUp ? "text-gray-500 bg-gray-100 cursor-not-allowed" : ""}`}
                      readOnly={selectedFollowUp}
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
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all 
    ${selectedFollowUp ? "text-gray-500 bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter customer name"
                    readOnly={selectedFollowUp}
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
                    value={customerNumber}
                    onChange={(e) => setCustomerNumber(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all 
    ${selectedFollowUp ? "text-gray-500 bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="Enter customer number"
                    readOnly={selectedFollowUp}
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

      {filteredFollowUps.length > itemsPerPage && (
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

export default FollowUp;
