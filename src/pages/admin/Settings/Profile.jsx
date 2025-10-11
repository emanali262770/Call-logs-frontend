import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiUser, FiMail, FiShield, FiEdit2, FiSave } from "react-icons/fi";
import { toast } from "react-toastify";

const Profile = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null, // for showing existing image or new upload
    name: "",
    username: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    address: "",
    number: "",
    role: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // ✅ Fetch user data from /auth/users
  // ✅ Fetch profile data only from /api/staff
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/staff`,
        
        );

        if (res.data?.success && Array.isArray(res.data.data)) {
          // Find the logged-in user's data
          const user = res.data.data.find(
            (u) => u.email === userInfo.email || u._id === userInfo._id
          );

          if (user) {
            setFormData((prev) => ({
              ...prev,
              image: null,
              imagePreview: user.image?.url || user.image || null,
              name: user.name || "",
              username: user.username || "",
              email: user.email || "",
              password: user.password || "",
              department: user.department || "",
              designation: user.designation || "",
              address: user.address || "",
              number: user.number || "",
              role: user.role || "",
            }));
          } else {
            toast.error("⚠️ User not found in staff records");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to load profile data");
      }
    };

    fetchUserData();
  }, []);

  // ✅ Handle changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: file ? URL.createObjectURL(file) : prev.imagePreview,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Save (PUT /auth/profile/update)
  const handleSave = async () => {
    try {
      setLoading(true);
      const data = new FormData();

      // Append all keys to form-data
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== "imagePreview") data.append(key, value);
      });

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile/update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userInfo?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        toast.success("✅ Profile updated successfully!");
        setEditing(false);
      } else {
        toast.error("❌ Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-newPrimary">My Profile</h1>
          <button
            onClick={() => {
              if (editing) handleSave();
              else setEditing(true);
            }}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors ${
              editing
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            }`}
          >
            {editing ? <FiSave size={16} /> : <FiEdit2 size={16} />}
            {editing ? "Save" : "Edit"}
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex items-center space-x-4 mb-8">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold shadow overflow-hidden">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                formData.name?.[0] || "U"
              )}
            </div>
            {editing && (
              <input
                ref={fileInputRef}
                id="imageUpload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            )}
          </label>

          <div>
            <p className="text-lg font-medium text-gray-800 capitalize">
              {formData.name || "No name"}
            </p>
            <p className="text-sm text-gray-500">{formData.email}</p>
            <p className="text-xs text-gray-400 uppercase">{formData.role}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "name",
            "username",
            "email",
            "password",
            "department",
            "designation",
            "address",
            "number",
          ].map((field) => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-600 capitalize">
                {field}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`mt-1 w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-newPrimary/40 outline-none ${
                  editing
                    ? "border-gray-300 bg-white"
                    : "bg-gray-100 border-gray-200 cursor-not-allowed"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Save button (for mobile) */}
        {editing && (
          <div className="mt-6 text-right">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
