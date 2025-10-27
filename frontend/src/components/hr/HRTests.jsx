import React from "react";

const HRTests = () => {
  const dummyTests = [
    { id: 1, name: "Leadership Assessment", created: "Oct 25, 2025" },
    { id: 2, name: "Learning Culture Survey", created: "Oct 22, 2025" },
  ];

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h1 className="text-xl font-semibold mb-4 text-gray-700">Your Tests</h1>
      <ul>
        {dummyTests.map((test) => (
          <li
            key={test.id}
            className="flex justify-between items-center py-2 border-b border-gray-100"
          >
            <span>{test.name}</span>
            <span className="text-sm text-gray-500">{test.created}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HRTests;
