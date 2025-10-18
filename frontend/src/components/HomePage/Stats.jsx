import React from "react";

const Stats = () => {
  const data = [
    { value: "500+", label: "HR Assessments Created" },
    { value: "2K+", label: "Reports Generated" },
    { value: "150+", label: "Organizations Onboarded" },
  ];

  return (
    <section className="py-16 bg-white text-center">
      <div className="flex flex-col md:flex-row justify-center gap-12">
        {data.map((stat, i) => (
          <div key={i} className="flex flex-col">
            <h3 className="text-4xl font-bold text-brand-500">{stat.value}</h3>
            <p className="text-gray-600 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
