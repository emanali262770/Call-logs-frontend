import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Automatically attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userInfo"); // or sessionStorage if you're using that
  console.log(token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosInstance;
