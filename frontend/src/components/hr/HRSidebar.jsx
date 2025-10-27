import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart2,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const HRSidebar = ({ isOpen }) => {
  const [openTests, setOpenTests] = useState(false);
  const [openReports, setOpenReports] = useState(false);

  const mainLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-md text-[15px] font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-700 font-semibold"
        : "text-gray-800 hover:bg-gray-100"
    }`;

  const childLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-2 py-2 rounded-md text-[14px] transition-all duration-200 ${
      isActive
        ? "text-indigo-700 font-semibold"
        : "text-gray-700 hover:text-indigo-600"
    }`;

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] border-r bg-white shadow-sm transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col justify-between`}
    >
      {/* === MENU SECTION === */}
      <div className="flex flex-col mt-6">
        {/* Dashboard */}
        <NavLink to="/hr/dashboard/home" className={mainLinkClass}>
          <LayoutDashboard size={20} />
          {isOpen && <span>Dashboard</span>}
        </NavLink>

        {/* HR Tests Section */}
        <div className="mt-2">
          <button
            onClick={() => setOpenTests(!openTests)}
            className="flex items-center justify-between w-full px-4 py-2 text-[15px] text-gray-800 font-medium hover:bg-gray-100 rounded-md"
          >
            <div className="flex items-center gap-3">
              <ClipboardList size={20} />
              {isOpen && <span>HR Tests</span>}
            </div>
            {isOpen &&
              (openTests ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>

          {openTests && isOpen && (
            <div className="ml-6 mt-2 border-l border-gray-300 pl-4 flex flex-col gap-2">
              <NavLink to="/hr/tests" className={childLinkClass}>
                All Tests
              </NavLink>
              <NavLink to="/hr/pending-tests" className={childLinkClass}>
                Pending Tests
              </NavLink>
            </div>
          )}
        </div>

        {/* Reports Section */}
        <div className="mt-2">
          <button
            onClick={() => setOpenReports(!openReports)}
            className="flex items-center justify-between w-full px-4 py-2 text-[15px] text-gray-800 font-medium hover:bg-gray-100 rounded-md"
          >
            <div className="flex items-center gap-3">
              <BarChart2 size={20} />
              {isOpen && <span>Reports</span>}
            </div>
            {isOpen &&
              (openReports ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
          </button>

          {openReports && isOpen && (
            <div className="ml-6 mt-2 border-l border-gray-300 pl-4 flex flex-col gap-2">
              <NavLink to="/hr/reports" className={childLinkClass}>
                View Reports
              </NavLink>
              <NavLink to="/hr/profile" className={childLinkClass}>
                HR Profile
              </NavLink>
            </div>
          )}
        </div>
      </div>

      {/* === LOGOUT BUTTON === */}
      <div className="p-4 mb-3">
        <button className="w-full py-2 flex items-center justify-center gap-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition">
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default HRSidebar;
