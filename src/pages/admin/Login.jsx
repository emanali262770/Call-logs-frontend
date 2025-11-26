import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../context/authSlice";
import { set } from "date-fns";
import { Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    gsap.from(".login-box", { opacity: 0, y: 50, duration: 1 });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,

        { email, password }
      );
      console.log("Login response:", response.data);

      const { token, user } = response.data;

      // ✅ Merge token with user and save as userInfo
      const userInfo = { ...user, token };

      // ✅ Store in Redux (will also store in localStorage via authSlice)
      dispatch(loginSuccess(userInfo));
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      // ✅ Toast and redirect
      toast.success("Logged in successfully 🎉");
      console.log("Stored userInfo:", userInfo);

      if (user.isAdmin === true || user.isAdmin === false) {
        navigate("/admin");
      } else {
        navigate("/");
      }

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white px-6 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold mb-2">
            Logo
          </div>
          <h2 className="text-2xl font-semibold mb-2">Login</h2>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />

              {/* 👁️ Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-semibold transition-all disabled:opacity-70"
          >
            {loading ? <Loader className="animate-spin" size={22} /> : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-700">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
      {/* Right: Illustration */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center">
        <img
          src="/images/login.avif"
          alt="Login Illustration"
          className="max-w-[80%] h-auto"
        />
      </div>
    </div>
  );
};

export default Login;
