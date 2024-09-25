import React from 'react';
import './AboutLanding.css';

const AboutLanding = () => {

  const heading_1 = "Learn to Build";
  const heading_2 = "Unbreakable Code.";
  const desc_1 = "Building secure applications shouldn't be a headache."
  const span_value = <span className="text-cyan-100 font-bold">Quan C </span> 
  const desc_2 = "is your interactive platform designed to make learning."
  const desc_3 = "secure programming practices fun, engaging, and effective."

  return (
    <div className="relative flex items-center justify-container min-h-screen bg-background-default p-8 md:flex-row flex-col lg:ms-48">
      {/* Blurred Background */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[-300px] w-[300px] h-[300px] rounded-full rotate-[135deg] bg-gradient-to-b from-cyan-100 to-blue-100 blur-[140px] opacity-75"
      ></div>
      <div
        aria-hidden="true"
        className="absolute inset-y-0 top-[200px] right-[200px] w-[300px] h-[300px] rounded-full rotate-[135deg] bg-gradient-to-b from-cyan-100 to-blue-100 blur-[140px] opacity-75"
      ></div>

      {/* Right Section: Image */}
      <div className="relative flex-shrink-0 md:w-1/2 w-full md:order-2 order-1">
        <img
          src={`${process.env.PUBLIC_URL}/secure-device.png`}
          alt="Secure Device"
          className="w-[100%] max-w-xl"
        />
      </div>

      {/* Left Section: Text and Button */}
      <div className="relative max-w-3xl md:max-w-l md:w-1/2 w-full md:order-1 order-2 paragraph-text">
        <h1 className="text-white heading-text">
          {heading_1} <br />
          <span className="text-cyan-100">{heading_2}</span>
        </h1>
        <p className="text-white text-base mb-8 ">
          {desc_1}
          <br />
          {span_value}
          {desc_2}
          <br />
          {desc_3}
        </p>
        <button className="px-6 py-3 text-white bg-transparent border-2 border-white rounded-xl hover:bg-cyan-100 hover:border-cyan-100 hover:text-background-default">
          Learn more
        </button>
      </div>
    </div>
  );
};

export default AboutLanding;