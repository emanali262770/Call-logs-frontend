import React, { useState, useEffect, useCallback } from "react";
import {
  FiSearch,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiUser,
  FiPhone,
} from "react-icons/fi";
import { Eye } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import SuccessClientViewModal from "./SuccessClientViewModal";

const SuccessClient = () => {
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedViewData, setSelectedViewData] = useState(null);
  const [clientList, setClientList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredClients = clientList.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.companyName?.toLowerCase().includes(query) ||
      client.person?.persons?.[0]?.phoneNumber?.toLowerCase().includes(query) ||
      client.product?.name?.toLowerCase().includes(query) ||
      client.status?.toLowerCase().includes(query)
    );
  });

  const fetchClientData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/meetings/success-client`
      );

      console.log(response.data.data, "data");

      setClientList(response.data.data);
    } catch (error) {
      console.error("Error fetching success clients:", error);
      toast.error("Failed to load success clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientData();
  }, [fetchClientData]);

  const handleDelete = async (id) => {
    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token}`,
      };
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/meetings/${id}`,
        { headers }
      );
      setClientList((prev) => prev.filter((c) => c.id !== id));
      fetchClientData();
      toast.success("Client deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete client");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">
            Success Clients
          </h1>
          <p className="text-gray-500 text-sm">
            Manage successfully onboarded clients
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="hidden md:grid grid-cols-6 gap-4 bg-gray-50 py-3 px-4 text-xs font-medium text-gray-500 uppercase rounded-lg">
            <div>Client Name</div>
            <div>Number</div>
            <div>Project</div>
            <div>Date</div>
            <div>TimeLine</div>
            {userInfo.isAdmin && <div className="text-right">Actions</div>}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {filteredClients.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200 text-gray-500 text-sm">
                No clients found.
              </div>
            ) : (
              currentClients.map((client) => (
                <div
                  key={client._id}
                  className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  {/* Client Name */}
                  <div className="hidden md:flex items-center text-sm font-medium text-gray-900 truncate">
                    <FiUser className="mr-2 text-gray-400" />
                    {client.companyName || "N/A"}
                  </div>

                  {/* Phone Number */}
                  <div className="hidden md:flex items-center text-sm text-gray-500 truncate">
                    <FiPhone className="mr-2 text-gray-400" />
                    {client.person?.persons?.[0]?.phoneNumber || "N/A"}
                  </div>

                  {/* Product */}
                  <div className="hidden md:block text-sm text-gray-500 truncate">
                    {client.product?.name || "N/A"}
                  </div>

                  {/* Last Follow Date */}
                  <div className="hidden md:flex items-center text-sm text-gray-500">
                    <FiCalendar className="mr-2 text-gray-400" />
                    {client.followDates?.length > 0
                      ? new Date(
                          client.followDates[client.followDates.length - 1]
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        client.Timeline === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {client.Timeline}
                    </span>
                  </div>

                  {/* Actions */}
                  {userInfo.isAdmin && (
                    <div className="flex justify-end">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedViewData(client);
                            setIsView(true);
                          }}
                          className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isView && selectedViewData && (
        <SuccessClientViewModal
          data={selectedViewData}
          onClose={() => setIsView(false)}
        />
      )}

      {/* Pagination Controls */}
      {filteredClients.length > itemsPerPage && (
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

export default SuccessClient;
