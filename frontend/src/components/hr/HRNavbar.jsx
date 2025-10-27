import React from "react";
import { Menu, Bell, UserCircle } from "lucide-react";

const HRNavbar = ({ toggleSidebar }) => {
  return (
    <header className="flex items-center justify-between bg-white shadow-sm border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-700">HRInsight Pro</h1>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <UserCircle size={26} className="text-gray-600" />
          <span className="hidden sm:block text-gray-700 font-medium">
            Jane Doe (HR)
          </span>
        </div>
      </div>
    </header>
  );
};

export default HRNavbar;
