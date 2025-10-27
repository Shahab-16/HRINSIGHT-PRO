import React from "react";
import { FaUsers, FaChartLine, FaClipboardList, FaAward } from "react-icons/fa";

const HRHome = () => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-indigo-100 to-white p-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 rounded-3xl bg-white shadow-2xl p-10 text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-400 rounded-full opacity-20 filter blur-3xl"></div>

        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 flex justify-center items-center gap-3">
          HRInsight Pro <span className="text-indigo-600 text-3xl font-bold">Dashboard</span>
        </h1>
        <p className="text-gray-600 text-lg font-medium mb-4">
          Empowering HR Teams with Data-Driven Insights
        </p>
      </div>

      {/* Key Stats */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        {[
          { icon: <FaClipboardList className="text-indigo-600" />, label: "Total Tests", value: "24" },
          { icon: <FaUsers className="text-green-600" />, label: "Participants", value: "156" },
          { icon: <FaChartLine className="text-yellow-600" />, label: "Avg Maturity", value: "3.2 / 4" },
          { icon: <FaAward className="text-pink-600" />, label: "Reports Generated", value: "78" },
        ].map(({ icon, label, value }, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-[1.05] transition-transform duration-300"
          >
            <div className="text-4xl mb-3">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{label}</h3>
            <p className="text-3xl font-extrabold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Summary Sections */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 mb-16">
        {/* Insights */}
        <div className="flex-1 bg-indigo-900 rounded-2xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-2">Key Insights</h2>
          <ul className="list-disc list-inside space-y-3 text-lg">
            <li>High performance in Leadership & Culture areas.</li>
            <li>Developmental need in Employee Engagement.</li>
            <li>Improved maturity in Recruitment processes.</li>
          </ul>
        </div>

        {/* Recommendations */}
        <div className="flex-1 bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 border-b border-indigo-300 pb-2">
            Recommended Actions
          </h2>
          <ul className="list-disc list-inside space-y-3 text-lg">
            <li>Conduct leadership capability workshops.</li>
            <li>Improve employee communication initiatives.</li>
            <li>Enhance learning culture and mentorship programs.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HRHome;
