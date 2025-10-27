import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHome from "../../components/admin/AdminHome";
import ManageQuestions from "../../components/admin/ManageQuestions";
import ManageTests from "../../components/admin/ManageTests";
import ManageReports from "../../components/admin/ManageReports";
import SendInvites from "../../components/admin/SendInvites";
import AdminProfile from "../../components/admin/AdminProfile";
import AddQuestions from "../../components/admin/AddQuestions";
import ListQuestions from "../../components/admin/ListQuestions";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <AdminNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out overflow-y-auto p-6 mt-16 ${
            isSidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Routes>
            <Route path="/dashboard" element={<AdminHome />} />
            <Route path="/questions" element={<ManageQuestions />} />
            <Route path="/tests" element={<ManageTests />} />
            <Route path='/add-questions' element={<AddQuestions />} />
            <Route path='/list-questions' element={<ListQuestions />} />
            <Route path="/invites" element={<SendInvites />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
