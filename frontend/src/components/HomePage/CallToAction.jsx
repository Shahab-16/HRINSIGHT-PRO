import React from "react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-800 to-indigo-600 text-center text-white">
      <h2 className="text-4xl font-extrabold mb-4">
        Ready to Elevate Your HR Strategy?
      </h2>
      <p className="text-lg text-blue-100 mb-8">
        Start building smarter HR diagnostics and unlock data-driven growth today.
      </p>
      <Link
        to="/login"
        className="bg-white text-blue-800 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-blue-50 transition duration-300"
      >
        Get Started Now
      </Link>
    </section>
  );
};

export default CallToAction;
