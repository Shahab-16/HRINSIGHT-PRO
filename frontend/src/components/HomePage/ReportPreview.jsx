import React from "react";
import { FiPieChart } from "react-icons/fi"; // or FaChartRadar, RiRadarLine, etc.

const ReportPreview = () => {
  return (
    <section
      id="reports"
      className="py-16 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10"
    >
      {/* Text block */}
      <div className="md:w-1/2 space-y-5">
        <h3 className="text-3xl font-bold text-gray-800">
          AI-Generated <span className="text-brand-500">HR Maturity Reports</span>
        </h3>
        <p className="text-gray-600 text-lg">
          Once candidates complete their assessment, HRInsight Pro analyzes responses,
          visualizes maturity across dimensions, and provides strengths and growth areas —
          all in one comprehensive report.
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Tabular and radar-based visualization</li>
          <li>Strategic AI interpretations</li>
          <li>Actionable HR recommendations</li>
        </ul>
      </div>

      {/* Icon block */}
      <div className="md:w-1/2 flex justify-center">
        <div className="bg-white shadow-md rounded-full p-10 md:p-14 flex items-center justify-center">
          <FiPieChart className="text-brand-500 w-32 h-32 md:w-40 md:h-40" />
        </div>
      </div>
    </section>
  );
};

export default ReportPreview;
