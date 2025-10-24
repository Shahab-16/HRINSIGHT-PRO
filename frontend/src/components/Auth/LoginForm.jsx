import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ImCross, ImArrowLeft2 } from "react-icons/im";
import { FaUserShield, FaUserPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false);
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
      if (currState === "Login") {
        const res = await axios.post(`http://localhost:5000/api/${role}/login`, {
          email: formData.email,
          password: formData.password,
        });

        toast.success(`${role} logged in successfully`);
        navigate(`/${role}/dashboard`);
      } else if (currState === "Register" && role === "hr") {
        const res = await axios.post(`http://localhost:5000/hr/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        toast.success("HR registered successfully");
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
            {currState === "Login" ? "Welcome Back!" : "Register as HR"}
          </h2>

          {/* Switch Tabs */}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {loading
                ? "Please wait..."
                : currState === "Login"
                ? "Login"
                : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
