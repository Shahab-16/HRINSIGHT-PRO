import React from "react";

export default function Features() {
  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Reports",
      desc: "Generate comprehensive maturity insights and recommendations instantly using GPT-5.",
    },
    {
      icon: "📊",
      title: "Visual Analytics",
      desc: "Interactive radar charts display area-wise performance for clear interpretation.",
    },
    {
      icon: "⚙️",
      title: "Custom Test Builder",
      desc: "Design diagnostic assessments with category-based questions and maturity scoring.",
    },
  ];

  return (
    <section id="features" className="py-16 px-6 md:px-12 bg-gray-50 text-center">
      <h3 className="text-3xl font-bold mb-10">Core Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <div className="text-5xl mb-4">{f.icon}</div>
            <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
