import React from "react";
import HRVideo from "../../assets/videos/HRVideo.mp4";

const VideoShowcase = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-100 overflow-hidden">
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
          See <span className="text-blue-600">HRInsight Pro</span> in Action
        </h2>
        <p className="text-gray-600 text-lg mt-3 max-w-2xl mx-auto">
          Experience how AI-driven analytics transform HR decision-making with
          real-time data visualization, assessment automation, and strategic insights.
        </p>
      </div>

      <div className="relative flex justify-center">
        <video
          src={HRVideo}
          className="rounded-2xl shadow-2xl w-[90%] md:w-[70%] lg:w-[60%] object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent rounded-2xl pointer-events-none"></div>
      </div>
    </section>
  );
};

export default VideoShowcase;
