import React from "react";
import { Link } from "react-router-dom";
import { FiBarChart2 } from "react-icons/fi";
import HeroSectionImg from "../../assets/images/HeroSection_Img.jpg";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br mt-16 from-blue-50 via-white min-h-[560px] to-indigo-100 py-16 px-6 md:px-16 flex flex-col-reverse md:flex-row items-center justify-between gap-2 overflow-hidden relative">
      {/* Left Content Section */}
      <div className="md:w-1/2 text-center md:text-left space-y-6 mt-10 md:mt-0 z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
          Empower{" "}
          <span className="text-blue-600 relative">
            HR Decisions
            <span className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 rounded-full opacity-60"></span>
          </span>{" "}
          with AI-Driven Insights
        </h1>

        <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
          Streamline your HR assessments, track performance trends, and generate
          automated diagnostic reports with the power of GPT-5 intelligence.
        </p>

        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition transform duration-300"
          >
            Get Started
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:scale-105 transition transform duration-300"
          >
            <FiBarChart2 className="text-xl" /> Explore Features
          </a>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="md:w-1/2 flex justify-end md:justify-center relative">
        <div className="relative translate-x-6 md:translate-x-10"> {/* Slightly shifted right */}
          {/* Background glow */}
          <div className="absolute -inset-6 bg-blue-200 blur-3xl opacity-40 rounded-full"></div>

          {/* Hero Image */}
          <img
            src={HeroSectionImg}
            alt="HR Team Collaboration"
            className="relative rounded-2xl shadow-2xl w-[100%] md:w-[95%] lg:w-[90%] object-cover transform hover:scale-110 transition duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
