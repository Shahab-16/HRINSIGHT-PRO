import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  Send,
  FileText,
  User,
  LogOut,
} from "lucide-react";

const AdminSidebar = ({ isOpen }) => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-[15px] transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 font-semibold"
        : "text-gray-800 hover:bg-gray-100"
    }`;

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r bg-white shadow-md transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col justify-between`}
    >
      {/* Menu Items */}
      <div className="flex flex-col mt-6">
        <NavLink to="/admin/dashboard" className={linkClass}>
          <LayoutDashboard size={20} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        <NavLink to="/admin/add-questions" className={linkClass}>
          <ClipboardList size={20} />
          {isOpen && <span>Add Questions</span>}
        </NavLink>

        <NavLink to="/admin/list-questions" className={linkClass}>
          <FileText size={20} />
          {isOpen && <span>List Questions</span>}
        </NavLink>

        <NavLink to="/admin/tests" className={linkClass}>
          <FileText size={20} />
          {isOpen && <span>Manage Tests</span>}
        </NavLink>

        <NavLink to="/admin/reports" className={linkClass}>
          <BarChart2 size={20} />
          {isOpen && <span>Reports</span>}
        </NavLink>

        <NavLink to="/admin/invites" className={linkClass}>
          <Send size={20} />
          {isOpen && <span>Send Invites</span>}
        </NavLink>

        <NavLink to="/admin/profile" className={linkClass}>
          <User size={20} />
          {isOpen && <span>Profile</span>}
        </NavLink>
      </div>

      {/* Logout */}
      <div className="p-4 mb-3">
        <button className="w-full py-2 flex items-center justify-center gap-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition">
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
