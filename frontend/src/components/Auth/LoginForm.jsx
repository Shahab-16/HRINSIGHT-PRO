import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ImCross, ImArrowLeft2 } from "react-icons/im";
import { FaUserShield, FaUserPlus, FaEnvelopeOpenText } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const BackendURL = import.meta.env.VITE_BACKEND_URL;

  const [currState, setCurrState] = useState("Login"); // Login | Register | Verify
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ LOGIN
      if (currState === "Login") {
        const res = await axios.post(`${BackendURL}/api/${role}/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem(`${role}Token`, res.data.token);
        toast.success(`${role.toUpperCase()} logged in successfully`);
        navigate(`/${role}/dashboard/home`);

        // ✅ REGISTER → send OTP
      } else if (currState === "Register" && role === "hr") {
        if (formData.password !== formData.confirmPassword)
          return toast.error("Passwords do not match!");

        await axios.post(`${BackendURL}/api/hr/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setOtpSent(true);
        setCurrState("Verify");
        toast.success("OTP sent to your email");

        // ✅ VERIFY OTP
      } else if (currState === "Verify" && role === "hr") {
        const res = await axios.post(`${BackendURL}/api/hr/verify`, {
          email: formData.email,
          otp,
        });

        toast.success("Email verified successfully!");
        setCurrState("Login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/login");

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100">
      <div className="w-[850px] h-[550px] rounded-2xl bg-white shadow-2xl flex overflow-hidden relative">
        {/* Navigation Icons */}
        <ImCross
          className="absolute top-4 right-4 cursor-pointer w-6 h-6 text-gray-500 hover:text-red-600 transition-colors"
          onClick={goBack}
        />
        <ImArrowLeft2
          className="absolute top-4 left-4 cursor-pointer w-6 h-6 text-gray-500 hover:text-blue-600 transition-colors"
          onClick={goBack}
        />

        {/* Left Side Icon Section */}
        <div className="w-1/2 hidden lg:flex items-center justify-center bg-indigo-50">
          {role === "admin" ? (
            <FaUserShield className="text-[150px] text-indigo-500" />
          ) : (
            <FaUserPlus className="text-[150px] text-indigo-500" />
          )}
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
            {currState === "Login"
              ? "Welcome Back!"
              : currState === "Register"
              ? "Register as HR"
              : "Verify Your Email"}
          </h2>

          {/* Tabs */}
          {currState !== "Verify" && (
            <div className="flex justify-between mb-6 gap-4">
              <button
                className={`w-1/2 py-2 ${
                  currState === "Login"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                } hover:bg-blue-700 transition-colors rounded-lg`}
                onClick={() => setCurrState("Login")}
              >
                Login
              </button>

              {role === "hr" && (
                <button
                  className={`w-1/2 py-2 ${
                    currState === "Register"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  } hover:bg-blue-700 transition-colors rounded-lg`}
                  onClick={() => setCurrState("Register")}
                >
                  Register
                </button>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {currState === "Register" && role === "hr" && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}

            {/* Login / Register common inputs */}
            {currState !== "Verify" && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </>
            )}

            {/* Confirm Password (Register only) */}
            {currState === "Register" && role === "hr" && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}

            {/* OTP Field */}
            {currState === "Verify" && (
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none tracking-widest text-center text-lg font-semibold"
                  maxLength={6}
                />
                <p className="text-center text-gray-600 text-sm flex items-center justify-center gap-2">
                  <FaEnvelopeOpenText className="text-blue-500" /> Check your email for the OTP
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {loading
                ? "Please wait..."
                : currState === "Login"
                ? "Login"
                : currState === "Register"
                ? "Register"
                : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
