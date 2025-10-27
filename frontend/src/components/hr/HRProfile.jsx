import React from "react";

const HRNavbar = () => {
  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                HRInsight Pro
              </h1>
            </div>
          </div>
        </div>
      </nav>
      <p className="bg-black h-[1px] w-full"></p>
    </>
  );
};

export default HRNavbar;
