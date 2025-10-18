import React from "react";
import Navbar from "../components/HomePage/Navbar";
import HeroSection from "../components/HomePage/HeroSection";
import Features from "../components/HomePage/Features";
import Stats from "../components/HomePage/Stats";
import ReportPreview from "../components/HomePage/ReportPreview";
import Testimonials from "../components/HomePage/Testimonials";
import Footer from "../components/HomePage/Footer";

const Home = () => {
  return (
    <>
      <div className="flex flex-col max-w-[1400px] mx-auto gap-10">
        <Navbar />
        <HeroSection />
        <Features />
        <Stats />
        <ReportPreview />
        <Testimonials />
      </div>
      <Footer />
    </>
  );
};

export default Home;
