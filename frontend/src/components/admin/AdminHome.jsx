import React from "react";
import { BarChart3, ClipboardList, FileText } from "lucide-react";

const AdminHome = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome, Admin 👋
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition">
          <ClipboardList className="text-indigo-600" size={32} />
          <div>
            <p className="text-gray-700 font-medium">Questions</p>
            <h3 className="text-xl font-bold text-gray-900">125</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition">
          <FileText className="text-indigo-600" size={32} />
          <div>
            <p className="text-gray-700 font-medium">Tests Created</p>
            <h3 className="text-xl font-bold text-gray-900">12</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4 hover:shadow-lg transition">
          <BarChart3 className="text-indigo-600" size={32} />
          <div>
            <p className="text-gray-700 font-medium">Reports Generated</p>
            <h3 className="text-xl font-bold text-gray-900">47</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
