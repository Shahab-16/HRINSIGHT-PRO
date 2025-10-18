import React from "react";
import { Link } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi"; // Icon from react-icons (chart/analytics look)

const HeroSection = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-12">
      {/* Left text section */}
      <div className="md:w-1/2 text-center md:text-left space-y-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Empower <span className="text-brand-500">HR Decisions</span> with AI-Driven Insights
        </h2>
        <p className="text-gray-600 text-lg">
          Create, manage, and analyze HR diagnostic assessments effortlessly.
          Generate automated maturity reports powered by GPT-5 for actionable workforce insights.
        </p>
        <div className="space-x-4">
          <Link
            to="/admin/login"
            className="bg-brand-500 text-white px-6 py-3 rounded-lg font-medium shadow hover:bg-brand-600 transition"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="border border-brand-500 text-brand-500 px-6 py-3 rounded-lg font-medium hover:bg-brand-50 transition"
          >
            Explore Features
          </a>
        </div>
      </div>

      {/* Right icon section */}
      <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
        <div className="bg-white shadow-md rounded-full p-10 md:p-14 flex items-center justify-center">
          <FiBarChart2 className="text-brand-500 w-40 h-40 md:w-56 md:h-56" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
