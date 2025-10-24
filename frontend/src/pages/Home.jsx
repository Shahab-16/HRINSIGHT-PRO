import React from "react";
import Navbar from "../components/HomePage/Navbar";
import HeroSection from "../components/HomePage/HeroSection";
import Features from "../components/HomePage/Features";
import VideoShowcase from "../components/HomePage/VideoShowcase";
import Stats from "../components/HomePage/Stats";
import WhyChooseUs from "../components/HomePage/WhyChooseUs";
import ReportPreview from "../components/HomePage/ReportPreview";
import Testimonials from "../components/HomePage/Testimonials";
import CallToAction from "../components/HomePage/CallToAction";
import Footer from "../components/HomePage/Footer";

const Home = () => {
  return (
    <>
      <div className="flex flex-col max-w-[1400px] mx-auto gap-8">
        <Navbar />
        <HeroSection />
        <Features />
        <VideoShowcase />
        <Stats />
        <WhyChooseUs />
        <ReportPreview />
        <Testimonials />
        <CallToAction />
      </div>
      <Footer />
    </>
  );
};

export default Home;
