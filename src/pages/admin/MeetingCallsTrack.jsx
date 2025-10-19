import React, { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MeetingCallsTrack = () => {
  const [loading, setLoading] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [staffName, setStaffName] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("In-Person");
  const [phoneNo, setPhoneNo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingList, setMeetingList] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const fetchMeetingCalls = useCallback(async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo?.token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/meeting-calls`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch meeting calls: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Fetched meetings:", result.data);
      setMeetingList(result.data || []);
      setFilteredMeetings(result.data || []);
    } catch (err) {
      console.error("Fetch meeting calls error:", err);
      toast.error("Failed to fetch meeting calls!");
      setMeetingList([]);
      setFilteredMeetings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetingCalls();
  }, [fetchMeetingCalls]);

  useEffect(() => {
    const filtered = meetingList.filter((meeting) => {
      const query = searchQuery.toLowerCase();
      return (
        (meeting.customerName?.toLowerCase() || "").includes(query) ||
        (meeting.staffName?.toLowerCase() || "").includes(query) ||
        (meeting.location?.toLowerCase() || "").includes(query) ||
        (meeting.mode?.toLowerCase() || "").includes(query) ||
        (meeting.phoneNo?.toLowerCase() || "").includes(query)
      );
    });
    setFilteredMeetings(filtered);
    setCurrentPage(1);
  }, [searchQuery, meetingList]);

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
            setLoading(true);
            setMeetingList((prev) => prev.filter((item) => item.id !== id));
            setFilteredMeetings((prev) => prev.filter((item) => item.id !== id));
            toast.success("Meeting deleted successfully!");
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Meeting deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete meeting");
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete meeting.",
              "error"
            );
          } finally {
            setLoading(false);
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Meeting is safe 🙂",
            "info"
          );
        }
      });
  };

  const handleCloseModal = () => {
    setIsSliderOpen(false);
    setSelectedMeeting(null);
    setCustomerName("");
    setStaffName("");
    setLocation("");
    setMode("In-Person");
    setPhoneNo("");
    setDate("");
    setTime("");
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMeetings = filteredMeetings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Meeting Call Tracker
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your meeting call records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 text-xs font-medium text-gray-600 uppercase">
              <th className="py-3 px-4 w-[60px]">Sr#</th>
              <th className="py-3 px-4 w-[150px]">Customer Name</th>
              <th className="py-3 px-4 w-[150px]">Staff Name</th>
              <th className="py-3 px-4 w-[150px]">Location</th>
              <th className="py-3 px-4 w-[100px]">Mode</th>
              <th className="py-3 px-4 w-[150px]">Phone No.</th>
              <th className="py-3 px-4 w-[130px]">Date</th>
              <th className="py-3 px-4 w-[100px]">Time</th>
              <th className="py-3 px-4 text-right w-[100px]">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredMeetings.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-500">
                  No meetings found.
                </td>
              </tr>
            ) : (
              currentMeetings.map((meeting, index) => (
                <tr
                  key={meeting.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {meeting.customerName?.length > 17
                        ? `${meeting.customerName.slice(0, 17)}...`
                        : meeting.customerName || "N/A"}
                    </div>
                  </td>
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      {meeting.staffName || "N/A"}
                    </div>
                  </td>
                  <td className="py-3 px-4 truncate relative">
                    <div className="flex items-center gap-2 group relative">
                      {meeting.location ? (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            meeting.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <FiMapPin className="text-gray-400 cursor-pointer hover:text-newPrimary" />
                          <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-20 max-w-[200px] truncate shadow-md">
                            {meeting.location}
                          </span>
                        </a>
                      ) : (
                        <>
                          <FiMapPin className="text-gray-400" />
                          <span className="absolute left-0 top-full mt-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-20 max-w-[200px] truncate shadow-md">
                            No location available
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 truncate">{meeting.mode || "—"}</td>
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      {meeting.phoneNumber || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {meeting.date || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4 truncate">
                    <div className="flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      {meeting.time || "—"}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleDelete(meeting.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filteredMeetings.length > itemsPerPage && (
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="flex justify-center items-center gap-2 flex-wrap">
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

export default MeetingCallsTrack;