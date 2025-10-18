import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-center py-6 text-gray-600 mt-12">
      <p>© {new Date().getFullYear()} HRInsight Pro · Built with 💙 for smarter HR analytics.</p>
    </footer>
  );
};

export default Footer;
