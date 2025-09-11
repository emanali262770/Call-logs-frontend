import React, { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaCog, FaTimes, FaSearch, FaPlus, FaUser, FaList } from "react-icons/fa";

const AssignRights = () => {
  const [moduleList, setModuleList] = useState([]);
  const [assignRightsList, setAssignRightsList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [functionalityList, setFunctionalityList] = useState([]);
  const [functionalityModuleList, setFunctionalityModuleList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [selectedFunctionalities, setSelectedFunctionalities] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sliderRef = useRef(null);

  

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const headers = {
    Authorization: `Bearer ${userInfo?.token || ""}`,
    "Content-Type": "application/json",
  };

  const handleAddAssignRights = () => {
    setIsSliderOpen(true);
  };

  // GSAP Animation for Slider
  useEffect(() => {
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
          if (sliderRef.current) {
            sliderRef.current.style.display = "none";
          }
        },
      });
    }
  }, [isSliderOpen]);

  // Fetch Assign Rights Data
  const fetchRights = useCallback(async () => {
    try {
      // For demo purposes, use static data
      setAssignRightsList(staticRightsData);
      
      // Uncomment for real API call
      // const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/rights`);
      // setAssignRightsList(data?.data || []);
    } catch (err) {
      console.error("Error fetching rights:", err);
    }
  }, []);

  // Fetch Group Data
  const fetchGroupData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Uncomment for real API call
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/groups`);
      
      // setGroups(response);
      if (!response.ok) throw new Error("Failed to fetch groups");
      const result = await response.json();
      setGroups(result);
    } catch (error) {
      console.error("Error fetching group data:", error);
      toast.error("Failed to fetch groups");
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Functionality Data
  const fetchFunctionalityData = useCallback(async () => {
    try {
      setLoading(true);
      // For demo purposes, use static data
      
      setFunctionalityList(staticFunctionalities);
      
      // Uncomment for real API call
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/functionality`);
      // if (!response.ok) throw new Error("Failed to fetch functionalities");
      // const result = await response.json();
      // setFunctionalityList(result);
    } catch (error) {
      console.error("Error fetching functionality data:", error);
      toast.error("Failed to fetch functionalities");
      setFunctionalityList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Module Data
  const fetchModuleData = useCallback(async () => {
    try {
      setLoading(true);
   
      setModuleList(staticModules);
      
      // Uncomment for real API call
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`);
      // if (!response.ok) throw new Error("Failed to fetch modules");
      // const result = await response.json();
      // setModuleList(result);
    } catch (error) {
      console.error("Error fetching module data:", error);
      toast.error("Failed to fetch modules");
      setModuleList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectModule = (e) => {
    const id = e.target.value;
    setSelectedFunctionalities([]);
    setModuleId(id);
    fetchFunctionalityModuleData(id);
  };

  // Fetch Functionality Data for a specific module
  const fetchFunctionalityModuleData = useCallback(async (moduleId) => {
    if (!moduleId) return;

    try {
      setLoading(true);
      // Filter functionalities by module for demo
      const moduleFunctionalities = functionalityList.filter(func => func.module === moduleId);
      setFunctionalityModuleList(moduleFunctionalities);
      
      // Uncomment for real API call
      // const response = await fetch(
      //   `${import.meta.env.VITE_API_BASE_URL}/functionality/module/${moduleId}`
      // );
      // if (!response.ok) throw new Error("Failed to fetch functionalities");
      // const result = await response.json();
      // setFunctionalityModuleList(result);
    } catch (error) {
      toast.error("Failed to fetch functionalities");
      setFunctionalityModuleList([]);
    } finally {
      setLoading(false);
    }
  }, [functionalityList]);

  // Fetch all data on mount
  useEffect(() => {
    fetchGroupData();
    fetchModuleData();
    fetchFunctionalityData();
    fetchRights();
  }, [fetchGroupData, fetchModuleData, fetchFunctionalityData, fetchRights]);

  // Filter rights based on search query
  const filteredRights = assignRightsList.filter(right => 
    right.group.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    right.module.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    right.functionalities.some(func => 
      func.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Save Assign Rights Data
  const handleSave = async () => {
    if (!groupId || !moduleId || selectedFunctionalities.length === 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const groupName = groups.find((g) => g._id === groupId)?.groupName || "";
      const moduleName = moduleList.find((m) => m._id === moduleId)?.moduleName || "";
      const functionalityIds = selectedFunctionalities.map(f => f._id);

      const payload = {
        group: groupId,
        module: moduleId,
        functionalities: functionalityIds,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token || ""}`,
          "Content-Type": "application/json",
        },
      };

      if (isEdit && editId) {
        // Update existing right
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/rights/${editId}`, payload, config);
        toast.success("✅ Right updated successfully");
      } else {
        // Add new right
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/rights`, payload, config);
        toast.success("✅ Right added successfully");
      }

      // Reset fields and refresh data
      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);
      setGroupId("");
      setModuleId("");
      setSelectedFunctionalities([]);
      fetchRights();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} right failed`);
    }
  };

  // Edit Assign Rights
  const handleEdit = (right) => {
    setIsEdit(true);
    setEditId(right._id);
    setGroupId(right?.group?._id || "");
    setModuleId(right?.module?._id || "");
    
    const functionalities = Array.isArray(right.functionalities)
      ? right.functionalities.map(f => ({ _id: f._id, name: f.name }))
      : [];
      
    setSelectedFunctionalities(functionalities);
    setIsSliderOpen(true);
  };

  // Delete Assign Rights
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-newPrimary text-white px-4 py-2 rounded-lg",
        cancelButton: "bg-gray-300 text-gray-700 px-4 py-2 rounded-lg",
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
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/rights/${id}`, {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            });

            setAssignRightsList(assignRightsList.filter((p) => p._id !== id));
            swalWithTailwindButtons.fire("Deleted!", "Right deleted successfully.", "success");
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire("Error!", "Failed to delete Right.", "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "Right is safe 🙂", "info");
        }
      });
  };

  // Handle Functionality Selection
  const handleFunctionalitySelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedFunc = functionalityModuleList.find(
      (func) => func._id === selectedId
    );

    if (selectedFunc) {
      setSelectedFunctionalities((prev) => {
        if (prev.some((f) => f._id === selectedFunc._id)) return prev;
        return [...prev, { _id: selectedFunc._id, name: selectedFunc.name }];
      });
    }

    e.target.value = ""; // reset dropdown
  };

  // Remove a functionality
  const removeFunctionality = (funcId) => {
    setSelectedFunctionalities(
      selectedFunctionalities.filter((func) => func._id !== funcId)
    );
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">Assign Rights</h1>
          <p className="text-gray-500 text-sm">Manage group permissions and access rights</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search rights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>
          
          <button
            onClick={handleAddAssignRights}
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
          >
            <FaPlus className="text-lg" />
            <span>Add Right</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-4 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Group</div>
              <div>Module</div>
              <div>Functionalities</div>
              {userInfo?.isAdmin && (
                <div className="text-right">Actions</div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {filteredRights.length > 0 ? (
                filteredRights.map((right) => (
                  <div
                    key={right._id}
                    className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    {/* Mobile view header */}
                    <div className="md:hidden flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <FaUser className="text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{right.group.groupName}</div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {right.module.moduleName}
                        </span>
                      </div>
                    </div>
                    
                    {/* Desktop view cells */}
                    <div className="hidden md:flex items-center text-sm font-medium text-gray-900 truncate">
                      <FaUser className="mr-2 text-gray-400" />
                      {right.group.groupName}
                    </div>
                    <div className="hidden md:flex items-center text-sm font-semibold text-green-600 truncate">
                      <FaList className="mr-2 text-gray-400" />
                      {right.module.moduleName}
                    </div>
                    <div className="hidden md:block text-sm text-gray-500">
                      {right.functionalities.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {right.functionalities.slice(0, 3).map((func) => (
                            <span key={func._id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {func.name}
                            </span>
                          ))}
                          {right.functionalities.length > 3 && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                              +{right.functionalities.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </div>
                    
                    {/* Mobile view content */}
                    <div className="md:hidden grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs text-gray-500">Module:</div>
                      <div className="text-sm font-semibold text-green-600">{right.module.moduleName}</div>
                      
                      <div className="text-xs text-gray-500">Functionalities:</div>
                      <div className="text-sm">
                        {right.functionalities.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {right.functionalities.slice(0, 2).map((func) => (
                              <span key={func._id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                {func.name}
                              </span>
                            ))}
                            {right.functionalities.length > 2 && (
                              <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full text-xs">
                                +{right.functionalities.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                    
                    {/* Actions - visible on both mobile and desktop */}
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end md:justify-end col-span-1 md:col-span-1 mt-2 md:mt-0">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(right)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(right._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No rights found. {assignRightsList.length === 0 ? "Add your first right to get started." : "Try a different search."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div
            ref={sliderRef}
            className="w-full md:w-1/2 lg:w-1/3 bg-white h-full overflow-y-auto shadow-lg"
            style={{ display: "block" }}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">{isEdit ? "Edit Right" : "Add Right"}</h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={() => setIsSliderOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Group</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                >
                  <option value="">Select Group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Module</label>
                <select
                  value={moduleId}
                  onChange={selectModule}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                >
                  <option value="">Select Module</option>
                  {moduleList.map((module) => (
                    <option key={module._id} value={module._id}>
                      {module.moduleName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Functionalities</label>
                <select
                  onChange={handleFunctionalitySelect}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                >
                  <option value="">Select functionality</option>
                  {functionalityModuleList
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
                  onClick={() => setIsSliderOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-newPrimary text-white px-4 md:px-6 py-2 rounded-lg hover:bg-primaryDark transition-colors duration-200"
                  onClick={handleSave}
                >
                  {isEdit ? "Update Right" : "Save Right"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRights;