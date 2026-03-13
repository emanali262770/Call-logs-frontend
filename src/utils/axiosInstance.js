import axios from "axios";

const getStoredToken = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    return userInfo?.token || "";
  } catch {
    return "";
  }
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Automatically attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


export default axiosInstance;
