import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 shadow-sm bg-white sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-brand-600 tracking-tight">
        HRInsight <span className="text-brand-500">Pro</span>
      </h1>

      <div className="flex gap-6 text-gray-700 font-medium">
        <a href="#features" className="hover:text-brand-500">Features</a>
        <a href="#reports" className="hover:text-brand-500">Reports</a>
        <a href="#testimonials" className="hover:text-brand-500">Testimonials</a>
        <Link
          to="/admin/login"
          className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition"
        >
          Admin Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
