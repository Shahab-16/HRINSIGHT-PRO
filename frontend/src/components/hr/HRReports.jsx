import React from "react";

const HRReports = () => {
  const dummyReports = [
    { id: 1, name: "Leadership Assessment", score: "3.2", date: "Oct 20, 2025" },
    { id: 2, name: "Learning Culture Survey", score: "2.8", date: "Oct 18, 2025" },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h1 className="text-xl font-semibold mb-4 text-gray-700">Reports</h1>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="p-2">Test Name</th>
            <th className="p-2">Maturity Score</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {dummyReports.map((r) => (
            <tr key={r.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{r.name}</td>
              <td className="p-2">{r.score}</td>
              <td className="p-2">{r.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HRReports;
