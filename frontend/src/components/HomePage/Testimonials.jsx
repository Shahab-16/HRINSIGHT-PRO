import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "HRInsight Pro simplified how we assess leadership and learning culture maturity across teams. The AI reports are spot-on.",
      name: "Priya Verma",
      role: "HR Director, FinexCorp",
    },
    {
      quote:
        "The radar charts and AI insights helped us design targeted HR interventions. Game-changer for diagnostics!",
      name: "Rakesh Nair",
      role: "Talent Head, BlueBridge Pvt Ltd",
    },
  ];

  return (
    <section id="testimonials" className="bg-gray-50 py-16 text-center">
      <h3 className="text-3xl font-bold mb-10">What HR Leaders Say</h3>
      <div className="flex flex-col md:flex-row gap-8 justify-center px-8 md:px-20">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-2xl p-8 w-full md:w-1/2"
          >
            <p className="text-gray-600 italic mb-4">“{t.quote}”</p>
            <h4 className="font-semibold text-brand-500">{t.name}</h4>
            <p className="text-gray-500 text-sm">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
