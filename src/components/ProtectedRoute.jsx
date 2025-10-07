import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const [isValid, setIsValid] = useState(null);
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const API_URL = "https://call-logs-backend.vercel.app/api/token/check";

  useEffect(() => {
    const checkTokenValidOrNot = async () => {
      if (!user || !user.token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        console.log({ res });

        if (res.data.success === false) {
          localStorage.clear();
          setIsValid(false);
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        localStorage.clear();
        setIsValid(false);
      }
    };

    checkTokenValidOrNot();
  }, []);

  // Show nothing (or a loader) while verifying
  if (isValid === null) return null;

  // Redirect if user not found or invalid
  if (!user || !isValid) return <Navigate to="/" replace />;

  // Optional: Role-based protection
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
