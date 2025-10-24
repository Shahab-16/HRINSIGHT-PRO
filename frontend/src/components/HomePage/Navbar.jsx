import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-16 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold tracking-tight text-blue-700 flex items-center gap-1"
        >
          HRInsight <span className="text-blue-500">Pro</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#reports" className="hover:text-blue-600 transition">
            Reports
          </a>
          <a href="#testimonials" className="hover:text-blue-600 transition">
            Testimonials
          </a>

          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden" ref={dropdownRef}>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            {menuOpen ? (
              <FiX className="w-6 h-6 text-gray-700" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-6 top-16 w-56 bg-white rounded-lg shadow-lg border border-gray-100 animate-fade-in">
              <div className="flex flex-col text-gray-700 font-medium">
                <a
                  href="#features"
                  className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg transition"
                >
                  Features
                </a>
                <a
                  href="#reports"
                  className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Reports
                </a>
                <a
                  href="#testimonials"
                  className="px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Testimonials
                </a>
                <div className="border-t border-gray-200"></div>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-b-lg transition"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
