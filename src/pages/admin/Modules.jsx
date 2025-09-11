import React, { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from 'axios';
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiX, FiBook, FiFileText } from "react-icons/fi";

const Modules = () => {
  const [moduleList, setModuleList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const sliderRef = useRef(null);

  // Filter modules based on search query
  const filteredModules = moduleList.filter(module => 
    module.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (module.description && module.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddModule = () => {
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
          sliderRef.current.style.display = "none";
        },
      });
    }
  }, [isSliderOpen]);

  // Token
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch Module Data
  const fetchModuleData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules`);
      const result = await response.json();
      setModuleList(result);
    } catch (error) {
      console.error("Error fetching module data:", error);
      toast.error("Failed to load modules");
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  // Save Module Data
  const handleSave = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
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
        moduleName,
        description,
      };

      if (isEdit && editId) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/modules/${editId}`,
          payload,
          { headers }
        );
        toast.success("✅ Module updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/modules`,
          payload,
          { headers }
        );
        toast.success("✅ Module added successfully");
      }

      setEditId(null);
      setIsEdit(false);
      setIsSliderOpen(false);
      setModuleName("");
      setDescription("");
      fetchModuleData();

    } catch (error) {
      console.error("Save error:", error.response?.data || error.message);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} module failed`);
    }
  };

  // Edit Module
  const handleEdit = (module) => {
    setIsEdit(true);
    setEditId(module._id);
    setModuleName(module.moduleName || "");
    setDescription(module.description || "");
    setIsSliderOpen(true);
  };

  // Delete Module
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
              toast.error("Authorization token missing!");
              return;
            }

            await axios.delete(
              `${import.meta.env.VITE_API_BASE_URL}/modules/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setModuleList(moduleList.filter((p) => p._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Module deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete Module.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Module is safe 🙂",
            "error"
          );
        }
      });
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HashLoader
            height="150"
            width="150"
            radius={1}
            color="#84CF16"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-newPrimary">Module List</h1>
          <p className="text-gray-500 text-sm">Module Management Dashboard</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary outline-none transition-all"
            />
          </div>
          
          {userInfo?.isAdmin && (
            <button
              onClick={handleAddModule}
              className="bg-newPrimary text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-primaryDark transition-all shadow-md hover:shadow-lg"
            >
              <FiPlus className="text-lg" />
              <span>Add Module</span>
            </button>
          )}
        </div>
      </div>

      {/* Module Table */}
      <div className="rounded-xl shadow p-4 md:p-6 border border-gray-100 w-full overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full">
            {/* Table Headers - hidden on mobile */}
            <div className="hidden md:grid grid-cols-3 gap-4 bg-gray-50 py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase rounded-lg">
              <div className="flex items-center">
                <FiBook className="mr-2" />
                Module Name
              </div>
              <div className="flex items-center">
                <FiFileText className="mr-2" />
                Description
              </div>
              {userInfo?.isAdmin && <div className="text-right">Actions</div>}
            </div>

            {/* Module List */}
            <div className="mt-4 flex flex-col gap-3">
              {filteredModules.length > 0 ? (
                filteredModules.map((module) => (
                  <div
                    key={module._id}
                    className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                  >
                    {/* Mobile view header */}
                    <div className="md:hidden flex justify-between items-center border-b pb-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <FiBook className="text-blue-600" />
                        </div>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {module.moduleName}
                        </div>
                      </div>
                    </div>
                    
                    {/* Desktop view cells */}
                    <div className="hidden md:flex items-center text-sm font-medium text-gray-900 truncate">
                      <FiBook className="mr-2 text-gray-400" />
                      {module.moduleName}
                    </div>
                    
                    <div className="hidden md:block text-sm text-gray-500 truncate">
                      {module.description || "No description"}
                    </div>
                    
                    {/* Mobile view content */}
                    <div className="md:hidden mt-2">
                      <div className="text-xs text-gray-500 mb-1">Description:</div>
                      <div className="text-sm text-gray-700">
                        {module.description || "No description"}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    {userInfo?.isAdmin && (
                      <div className="flex justify-end md:justify-end col-span-1 md:col-span-1 mt-2 md:mt-0">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(module)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(module._id)}
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
                  No modules found {searchQuery ? "matching your search" : ""}
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
              <h2 className="text-xl font-bold text-newPrimary">{isEdit ? "Edit Module" : "Add Module"}</h2>
              <button
                className="w-6 h-6 text-white rounded-full flex justify-center items-center hover:text-gray-400 text-xl bg-newPrimary"
                onClick={() => setIsSliderOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-5">
              {/* Module Section */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Module Name</label>
                <div className="relative">
                  <FiBook className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={moduleName}
                    onChange={(e) => setModuleName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter module name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-newPrimary/50 focus:border-newPrimary transition-all"
                    placeholder="Enter description"
                    rows="4"
                  />
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
                  {isEdit ? "Update Module" : "Save Module"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;