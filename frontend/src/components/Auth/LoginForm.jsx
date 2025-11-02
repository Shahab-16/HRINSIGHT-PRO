// src/components/Auth/LoginForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ImCross, ImArrowLeft2 } from "react-icons/im";
import { FaUserShield, FaUserPlus, FaEnvelopeOpenText } from "react-icons/fa";
import { toast } from "react-toastify";

const LoginForm = ({ inviteMode = false }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token") || null; // token from ?token=...
  const BackendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // If route param role exists (like /login/:role), we'll use it; else HR by default
  const role = params.role || "hr";

  const [currState, setCurrState] = useState("Login"); // Login | Register | Verify
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // If came via invite link or inviteMode prop, switch to Register
    if (inviteMode || inviteToken) {
      setCurrState("Register");
      if (inviteToken) {
        // optionally prefill email if token->server can return an invite email (not implemented here)
      }
    }
  }, [inviteMode, inviteToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const goBack = () => navigate("/login");

  const onLoginSuccessRedirect = () => {
    // If there is a token in search params (invite/test token) navigate to test page using token
    if (inviteToken) {
      // token is used as "testId" in route
      navigate(`/hr/test/${inviteToken}`);
    } else {
      // default dashboards
      if (role === "admin") navigate("/admin/dashboard");
      else navigate("/hr/dashboard");
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      if (currState === "Login") {
        // LOGIN
        const res = await axios.post(
          `${BackendURL}/api/${role}/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          { withCredentials: true }
        );

        // Save token locally (if backend returns token)
        if (res.data?.token) {
          localStorage.setItem(`${role}Token`, res.data.token);
        }

        toast.success(`${role.toUpperCase()} logged in successfully`);
        onLoginSuccessRedirect();
      } else if (currState === "Register" && role === "hr") {
        // REGISTER -> server sends OTP to email
        if (!formData.name || !formData.email || !formData.password) {
          toast.error("Please fill all required fields");
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match!");
          setLoading(false);
          return;
        }

        await axios.post(`${BackendURL}/api/hr/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setCurrState("Verify");
        toast.success("OTP sent to your email");
      } else if (currState === "Verify" && role === "hr") {
        // VERIFY OTP
        if (!otp || !formData.email) {
          toast.error("Provide OTP and Email");
          setLoading(false);
          return;
        }

        await axios.post(`${BackendURL}/api/hr/verify`, {
          email: formData.email,
          otp,
        });

        toast.success("Email verified successfully!");

        // After verification, if inviteToken exists → go to the test
        if (inviteToken) {
          navigate(`/hr/test/${inviteToken}`);
        } else {
          // go to login so user can login or we may auto-login if backend supplied token
          setCurrState("Login");
        }
      }
    } catch (err) {
      console.error("Auth error:", err?.response?.data || err.message || err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Left */}
        <div className="w-1/2 hidden lg:flex items-center justify-center bg-indigo-50">
          {role === "admin" ? (
            <FaUserShield className="text-[150px] text-indigo-500" />
          ) : (
            <FaUserPlus className="text-[150px] text-indigo-500" />
          )}
        </div>

        {/* Right Form */}
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
                  currState === "Login" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                } hover:bg-blue-700 transition-colors rounded-lg`}
                onClick={() => setCurrState("Login")}
              >
                Login
              </button>

              {role === "hr" && (
                <button
                  className={`w-1/2 py-2 ${
                    currState === "Register" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
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
                required
              />
            )}

            {currState !== "Verify" && (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </>
            )}

            {currState === "Register" && role === "hr" && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-[50px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            )}

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

          {currState !== "Verify" && (
            <p className="text-center text-gray-600 mt-4">
              {currState === "Login" ? (
                <>
                  Don’t have an account?{" "}
                  <button onClick={() => setCurrState("Register")} className="text-blue-600 hover:underline font-semibold">
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setCurrState("Login")} className="text-blue-600 hover:underline font-semibold">
                    Login here
                  </button>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
