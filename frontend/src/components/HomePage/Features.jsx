import React from "react";
import { FaBrain, FaChartPie, FaCogs } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: <FaBrain className="text-5xl text-blue-600 mb-4" />,
      title: "AI-Powered Reports",
      desc: "Leverage GPT-5 to instantly generate maturity insights, performance summaries, and actionable recommendations.",
    },
    {
      icon: <FaChartPie className="text-5xl text-indigo-600 mb-4" />,
      title: "Visual Analytics",
      desc: "Intuitive radar charts and performance dashboards to visualize growth across HR domains.",
    },
    {
      icon: <FaCogs className="text-5xl text-blue-500 mb-4" />,
      title: "Custom Test Builder",
      desc: "Easily create diagnostic assessments with role-specific questions and maturity-based scoring logic.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 px-6 md:px-12 bg-gradient-to-b from-white via-blue-50 to-white text-center"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
        Core <span className="text-blue-600">Features</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
        Designed for modern HR teams — streamline diagnostics, visualize
        performance, and unlock AI-powered insights that drive smarter
        decisions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((f, i) => (
          <div
            key={i}
            className="group relative bg-white border border-blue-100 shadow-md hover:shadow-xl rounded-2xl p-10 transition-transform duration-300 hover:-translate-y-2 hover:bg-gradient-to-b hover:from-blue-50 hover:to-white"
          >
            {/* Glow background */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-blue-500 blur-3xl rounded-2xl transition duration-300"></div>

            {/* Icon */}
            <div className="flex justify-center items-center">{f.icon}</div>

            {/* Title */}
            <h4 className="text-2xl font-bold text-gray-800 mb-3 mt-2">
              {f.title}
            </h4>

            {/* Description */}
            <p className="text-gray-600 text-base leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
