import React, { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiUsers, FiX } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";


const GroupManagement = () => {
  const [groupList, setGroupList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFunctionalities, setSelectedFunctionalities] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const sliderRef = useRef(null);

  // Safe userInfo parsing
  const getUserInfo = () => {
    try {
      const info = JSON.parse(localStorage.getItem("userInfo") || "{}");
      // console.log("Parsed userInfo:", info);
      return info;
    } catch (error) {
      console.error("Error parsing userInfo:", error);
      return {};
    }
  };

  const userInfo = getUserInfo();

  const functionalityModuleList = [
    "Products List",
    "Staff List",
    "Customer Data",
    "Meeting Details",
    "Follow Up",
    "Calendar",
    "Security",
    "Group Management",
    "Users",
    "Modules",
    "Modules Functionalities",
    "Access Control"
  ];

  // Convert strings to objects with _id and name
  const functionalityOptions = functionalityModuleList.map((name, index) => ({
    _id: index + 1, // or any unique id
    name
  }));


  // Filter groups based on search query
  const filteredGroups = groupList.filter(group =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // GSAP Animation for Slider
  useEffect(() => {
    if (sliderRef.current) {
      if (isSliderOpen) {
        sliderRef.current.style.display = "block";
        gsap.fromTo(
          sliderRef.current,
          { x: "100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      } else {
        gsap.to(sliderRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            sliderRef.current.style.display = "none";
          },
        });
      }
    }
  }, [isSliderOpen]);


  const handleFunctionalitySelect = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedFunc = functionalityOptions.find((f) => f._id === selectedId);
    if (selectedFunc && !selectedFunctionalities.some(f => f._id === selectedId)) {
      setSelectedFunctionalities([...selectedFunctionalities, selectedFunc]);
    }
  };

  const removeFunctionality = (funcId) => {
    setSelectedFunctionalities(
      selectedFunctionalities.filter((func) => func._id !== funcId)
    );
  };



  // ✅ Fetch Group Data (silent fallback)
  const fetchGroupData = useCallback(async () => {
    try {
      setLoading(true);

      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/groups`;

      const response = await fetch(apiUrl);

      let result = [];
      if (response.ok) {
        result = await response.json();
      }

      const list = Array.isArray(result) ? result : result?.data || [];
      setGroupList(list);

    } catch {
      setGroupList([]);
    } finally {
      setLoading(false);
    }
  }, [userInfo?.token]);

  // ✅ Fetch data on mount
  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData]);

  // Validate form
  const validateForm = () => {
    if (!groupName.trim()) return "Group name is required";
    return null;
  };

  // Save Group Data
  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(`❌ ${validationError}`);
      return;
    }

    try {
      const token = userInfo?.token;
      if (!token) {
        toast.error("❌ Authorization token missing!");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const payload = {
        groupName,
        functionalities: selectedFunctionalities.map(f => f.name), // send names to backend
      };

      console.log("Payload ", payload);


      if (isEdit && editId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/groups/${editId}`, payload, { headers });
        toast.success("✅ Group updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/groups`, payload, { headers });
        toast.success("✅ Group added successfully");
      }

      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);
      setGroupName("");
      fetchGroupData();
      setSelectedFunctionalities([])
    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} group failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Edit Group
  const handleEdit = (group) => {
    console.log("Edit", group);

    setIsEdit(true);
    setEditId(group._id);
    setGroupName(group.groupName || "");
    setSelectedFunctionalities(
      (group.functionalities || []).map((name, index) => ({
        _id: index + 1,
        name,
      }))
    );
  };

  // Delete Group
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
              toast.error("❌ Authorization token missing!");
              return;
            }

            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/groups/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            setGroupList(groupList.filter((p) => p._id !== id));
            swalWithTailwindButtons.fire("Deleted!", "Group deleted successfully.", "success");
          } catch (error) {
            console.error("Delete error:", error.response?.data || error.message);
            swalWithTailwindButtons.fire(
              "Error!",
              `Failed to delete Group: ${error.response?.data?.message || error.message}`,
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "Group is safe 🙂", "info");
        }
      });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HashLoader height="150" width="150" radius={1} color="#84CF16" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}. Data is using fallback values.
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">Group List</h1>
          <p className="text-gray-500 text-sm">Group Management Dashboard</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>

          <button
            onClick={() => {
              setGroupName("");
              setIsEdit(false);
              setEditId(null);
              setIsSliderOpen(true);
            }}
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
          >
            <FiPlus className="text-lg" />
            <span>Add Group</span>
          </button>
        </div>
      </div>

      {/* Group Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table Headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-3 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Group Name</div>
              <div>Functionalities</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            {/* Group Table */}
            {filteredGroups.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No groups found.</div>
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {filteredGroups.map((group) => (
                  <div
                    key={group._id}
                    className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    {/* Mobile view header */}
                    <div className="md:hidden flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <FiUsers className="text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{group.groupName}</div>
                      </div>
                    </div>



                    {/* Desktop view cells */}
                    <div className="hidden md:flex items-center text-sm font-medium text-gray-900 truncate">
                      <FiUsers className="mr-2 text-gray-400" />
                      {group.groupName}
                    </div>

                    <div className="hidden md:flex items-center text-sm font-medium text-gray-900 truncate">
                      {group.functionalities && group.functionalities.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {group.functionalities.slice(0, 6).map((func, index) => {
                            // Check if func is a string or object
                            const name = typeof func === "string" ? func : func.name;
                            return (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                              >
                                {name}
                              </span>
                            );
                          })}
                          {group.functionalities.length > 5 && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                              +{group.functionalities.length - 5} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </div>



                    {/* Actions - visible on both mobile and desktop */}
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end md:justify-end col-span-1 md:col-span-1 mt-2 md:mt-0">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(group)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(group._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right-Side Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-full md:w-1/2 lg:w-1/3 bg-white h-full overflow-y-auto shadow-lg"
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">{isEdit ? "Edit Group" : "Add Group"}</h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={() => {
                  setIsSliderOpen(false)
                  setSelectedFunctionalities([])
                  setEditId(null)
                }}
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Group Name <span className="text-newPrimary">*</span>
                </label>
                <div className="relative">
                  <FiUsers className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter group name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Functionalities</label>
                <select
                  onChange={handleFunctionalitySelect}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                  value=""
                >
                  <option value="">Select functionality</option>
                  {functionalityOptions
                    .filter((func) => !selectedFunctionalities.some(f => f._id === func._id))
                    .map((func) => (
                      <option key={func._id} value={func._id}>
                        {func.name}
                      </option>
                    ))}
                </select>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedFunctionalities.map((func) => (
                    <div
                      key={func._id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {func.name}
                      <button
                        type="button"
                        onClick={() => removeFunctionality(func._id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="px-4 md:px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => {
                    setGroupName("");
                    setIsEdit(false);
                    setEditId(null);
                    setSelectedFunctionalities([])
                    setIsSliderOpen(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-newPrimary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                  onClick={handleSave}
                >
                  {isEdit ? "Update Group" : "Save Group"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;