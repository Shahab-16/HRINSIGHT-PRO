import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import HRNavbar from "../../components/hr/HRNavbar";
import HRSidebar from "../../components/hr/HRSidebar";
import HRHome from "../../components/hr/HRHome";
import HRTests from "../../components/hr/HRTests";
import HRReports from "../../components/hr/HRReports";
import HRInvites from "../../components/hr/HRInvites";
import HRProfile from "../../components/hr/HRProfile";

const HRDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-50">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <HRNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <HRSidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main
          className={`flex-1 h-[calc(100vh-4rem)] overflow-y-auto transition-all duration-300 ease-in-out p-6 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Routes>
            <Route path="/dashboard/home" element={<HRHome />} />
            <Route path="/tests" element={<HRTests />} />
            <Route path="/reports" element={<HRReports />} />
            <Route path="/pending-tests" element={<HRInvites />} />
            <Route path="/profile" element={<HRProfile />} />
            <Route path="*" element={<Navigate to="/dashboard/home" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;
