import React from "react";
import { FaLinkedinIn, FaTwitter, FaEnvelope, FaYoutube, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-blue-50 border-t border-blue-100 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-gray-600">
        {/* Brand + About */}
        <div className="col-span-2">
          <h2 className="text-2xl font-bold text-blue-700 mb-3">
            HRInsight <span className="text-blue-500">Pro</span>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5">
            HRInsight Pro helps organizations transform people data into actionable
            intelligence with AI-driven diagnostics, maturity analytics, and
            role-specific insights for HR leaders.
          </p>

          {/* Social Media */}
          <div className="flex gap-4 text-gray-500 text-lg">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
              <FaLinkedinIn />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
              <FaFacebookF />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaYoutube />
            </a>
            <a href="mailto:support@hrinsightpro.com" className="hover:text-blue-600">
              <FaEnvelope />
            </a>
          </div>
        </div>

        {/* Platform Links */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Platform</h3>
          <ul className="space-y-2">
            <li><a href="#features" className="hover:text-blue-600 transition">Features</a></li>
            <li><a href="#reports" className="hover:text-blue-600 transition">Reports</a></li>
            <li><a href="#analytics" className="hover:text-blue-600 transition">Analytics Dashboard</a></li>
            <li><a href="#ai" className="hover:text-blue-600 transition">AI Integration</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Resources</h3>
          <ul className="space-y-2">
            <li><a href="#blog" className="hover:text-blue-600 transition">Blog & Insights</a></li>
            <li><a href="#case-studies" className="hover:text-blue-600 transition">Case Studies</a></li>
            <li><a href="#docs" className="hover:text-blue-600 transition">Documentation</a></li>
            <li><a href="#faq" className="hover:text-blue-600 transition">FAQs</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Company</h3>
          <ul className="space-y-2">
            <li><a href="#about" className="hover:text-blue-600 transition">About Us</a></li>
            <li><a href="#careers" className="hover:text-blue-600 transition">Careers</a></li>
            <li><a href="#contact" className="hover:text-blue-600 transition">Contact Us</a></li>
            <li><a href="#partners" className="hover:text-blue-600 transition">Partners</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-5 mt-10 border-t border-blue-100 pt-10 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Stay Updated</h3>
          <p className="text-gray-600 mb-5">
            Join our newsletter for HR tech trends, AI updates, and leadership insights.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex justify-center items-center gap-3 flex-col sm:flex-row"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="w-72 px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="text-center text-gray-500 text-sm py-6 border-t border-blue-100 bg-white/50">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold text-blue-600">HRInsight Pro</span> — 
          Empowering HR with AI-driven analytics and insight.
        </p>
        <div className="flex justify-center gap-6 mt-2 text-gray-400 text-xs">
          <a href="#privacy" className="hover:text-blue-600">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600">Terms of Service</a>
          <a href="#security" className="hover:text-blue-600">Security</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
