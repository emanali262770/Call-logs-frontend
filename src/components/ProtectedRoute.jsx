import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();

  // 🔹 URL → Permission Mapping
  const permissionMap = {
    "staff": "isStaff",
    "products": "isProduct",
    "customers": "isCustomer",
    "assign": "isAssign",
    "calendar": "isCalendar",
    "followup": "isFollow",
    "success-client": "isCustomer",
    "meetings": "isMeeting",
    "meetings-tracking": "isTrack",
    "history": "isHistory",
    "groups": "isSecurity",
    "users": "isSecurity",
    "modules-functionalities": "isSecurity",
  };

  useEffect(() => {
    if (!user?.token) {
      setIsValid(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/token/check`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setIsValid(res.data.success !== false);
      })
      .catch(() => {
        localStorage.clear();
        setIsValid(false);
      });
  }, []);

  // Still loading
  if (isValid === null) return null;

  // Invalid / no user
  if (!user || !isValid) return <Navigate to="/login" replace />;

  // ⭐ AUTO PERMISSION CHECK (This is the magic)
  const path = location.pathname.split("/")[2]; // e.g. "staff"
  const requiredPermission = permissionMap[path];

  if (!user.isAdmin && requiredPermission) {
    if (user[requiredPermission] !== true) {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
