import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUserCog } from "react-icons/fa";
import { ImCross } from "react-icons/im";

const LoginOptions = () => {
  const navigate = useNavigate();

  const handleOptionClick = (role) => {
    navigate(`/login/${role}`);
  };

  const handleClose = () => {
    navigate("/"); // Go back to home
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-100">
      <div className="w-[850px] h-[500px] rounded-2xl bg-white shadow-2xl border border-gray-300 flex overflow-hidden relative">
        {/* Cross Button */}
        <ImCross
          className="absolute top-4 left-4 text-gray-500 hover:text-red-600 cursor-pointer w-5 h-5 transition-colors"
          onClick={handleClose}
          title="Close and go back"
        />

        {/* Left Icon Section */}
        <div className="w-1/2 hidden lg:flex items-center justify-center bg-blue-50">
          <FaUserCog className="text-[160px] text-blue-500" />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-10 flex flex-col items-center justify-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Choose Your Role
          </h2>

          <button
            onClick={() => handleOptionClick("admin")}
            className="w-full py-3 mb-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:scale-105 transform transition duration-300 hover:from-green-600 hover:to-teal-600 text-lg font-semibold flex items-center justify-center gap-2"
          >
            <FaUserTie className="text-xl" />
            Admin
          </button>

          <button
            onClick={() => handleOptionClick("hr")}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:scale-105 transform transition duration-300 hover:from-blue-600 hover:to-indigo-600 text-lg font-semibold flex items-center justify-center gap-2"
          >
            <FaUserCog className="text-xl" />
            HR
          </button>

          <p className="mt-6 text-gray-600 text-sm text-center">
            Manage your HR platform securely with role-based access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginOptions;
