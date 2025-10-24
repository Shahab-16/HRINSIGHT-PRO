import React from "react";
import { FaBrain, FaUsersCog, FaChartLine } from "react-icons/fa";

const WhyChooseUs = () => {
  const cards = [
    {
      icon: <FaBrain className="text-4xl text-blue-600" />,
      title: "AI-Powered Analysis",
      desc: "Gain data-driven insights with GPT-5 generated HR diagnostics that help identify organizational strengths and areas of improvement.",
    },
    {
      icon: <FaUsersCog className="text-4xl text-blue-600" />,
      title: "Built for HR Teams",
      desc: "Role-based access and collaboration tools designed specifically for HR professionals and admins.",
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: "Visual Performance Tracking",
      desc: "Monitor progress with intuitive dashboards and radar charts for each domain or maturity area.",
    },
  ];

  return (
    <section className="py-20 bg-white text-center px-6">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
        Why Choose <span className="text-blue-600">HRInsight Pro?</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
        Our platform is built for HR professionals seeking smarter, data-backed
        workforce insights that drive meaningful organizational growth.
      </p>

      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-2xl p-8 hover:scale-105 transition transform duration-300 border border-blue-100"
          >
            <div className="flex justify-center mb-5">{card.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {card.title}
            </h3>
            <p className="text-gray-600">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
