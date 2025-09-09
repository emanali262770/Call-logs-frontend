import React, { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import { FiSearch, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";

const ModulesFunctionalities = () => {
  const [functionalityList, setFunctionalityList] = useState([]);
  const [modules, setModules] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [moduleId, setModuleId] = useState("");
  const [name, setName] = useState("");
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

  // Filter functionality list based on search query
  const filteredFunctionalityList = functionalityList.filter(
    (func) =>
      func?.moduleId?.moduleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      func.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFunctionality = () => {
    setIsSliderOpen(true);
  };

  // GSAP Animation for Slider
  useEffect(() => {
    if (isSliderOpen) {
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

  // Fetch Functionality Data
  const fetchFunctionalityData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/functionality`);
      if (!response.ok) throw new Error("Failed to fetch functionalities");
      const result = await response.json();
      console.log("Functionalities Response:", result);

      setFunctionalityList(result);
    } catch (error) {
      console.error("Error fetching functionality data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Module Data
  const fetchModuleData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`);

      if (!response.ok) throw new Error("Failed to fetch modules");
      const result = await response.json();
      console.log("Modules Response:", result);
      setModules(result);
    } catch (error) {
      console.error("Error fetching module data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchModuleData();
    fetchFunctionalityData();
  }, [fetchModuleData, fetchFunctionalityData]);

  // Save Functionality Data
  const handleSave = async () => {
    console.log("Module Id", moduleId);
    console.log("Functionality Name", name);

    if (!moduleId || !name) {
      toast.error("Please select a module and enter a functionality");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token || ""}`,
        },
      };

      if (isEdit && editId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/functionality/${editId}`,
          { moduleId, name },
          config
        );
        toast.success("✅ Functionality updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/functionality`,
          { moduleId, name },
          config
        );
        toast.success("✅ Functionality added successfully");
      }

      // Reset fields
      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);
      setModuleId("");
      setName("");
      fetchFunctionalityData(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} functionality failed`);
    }
  };

  // Edit Functionality
  const handleEdit = (func) => {
    setIsEdit(true);
    setEditId(func._id);
    setModuleId(func.moduleId || "");
    setName(func.name || "");
    setIsSliderOpen(true);
  };

  // Delete Functionality
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
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
            if (!userInfo?.token) {
              toast.error("Authorization token missing!");
              return;
            }

            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/functionality/${id}`, {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            });

            setFunctionalityList(functionalityList.filter((p) => p._id !== id));
            swalWithTailwindButtons.fire("Deleted!", "Functionality deleted successfully.", "success");
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire("Error!", "Failed to delete Functionality.", "error");
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire("Cancelled", "Functionality is safe 🙂", "info");
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">Functionality List</h1>
          <p className="text-gray-500 text-sm">Functionality Management Dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search functionalities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>
          
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
            onClick={handleAddFunctionality}
          >
            <FiPlus className="text-lg" />
            <span>Add Functionality</span>
          </button>
        </div>
      </div>

      {/* Functionality Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table Headers */}
            <div className="hidden md:grid grid-cols-3 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div>Module</div>
              <div>Functionality</div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            {/* Functionality Table */}
            <div className="mt-4 flex flex-col gap-3">
              {filteredFunctionalityList.length > 0 ? (
                filteredFunctionalityList.map((func) => (
                  <div
                    key={func._id}
                    className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    {/* Mobile view header */}
                    <div className="md:hidden flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900">{func?.moduleId?.moduleName}</div>
                      </div>
                    </div>
                    
                    {/* Desktop view cells */}
                    <div className="hidden md:block text-sm font-medium text-gray-900 truncate">
                      {func?.moduleId?.moduleName}
                    </div>
                    <div className="hidden md:block text-sm text-gray-500 truncate">
                      {func.name}
                    </div>
                    
                    {/* Mobile view content */}
                    <div className="md:hidden grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs text-gray-500">Functionality:</div>
                      <div className="text-sm">{func.name}</div>
                    </div>
                    
                    {/* Actions - visible on both mobile and desktop */}
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end md:justify-end col-span-1 md:col-span-1 mt-2 md:mt-0">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(func)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(func._id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No functionalities found {searchQuery && `matching "${searchQuery}"`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right-Side Slider */}
      {isSliderOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-end z-50">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-white h-full overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-newPrimary">{isEdit ? "Edit Functionality" : "Add Functionality"}</h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={() => setIsSliderOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Module</label>
                <select
                  value={moduleId}
                  onChange={(e) => setModuleId(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                >
                  <option value="">Select Module</option>
                  {modules.map((module) => (
                    <option key={module._id} value={module._id}>
                      {module.moduleName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Functionality</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                  placeholder="Enter functionality"
                />
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
                  {isEdit ? "Update Functionality" : "Save Functionality"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulesFunctionalities;