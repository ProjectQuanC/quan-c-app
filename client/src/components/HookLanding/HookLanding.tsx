import React from 'react';

const HookLanding = () => {
  return (
    <div className="relative h-[250px] w-full mt-48">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={`${process.env.PUBLIC_URL}/join-us.mp4`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-white text-center">
          <h1 className='text-6xl'>
            Secure the <span className='text-cyan-100'>Code</span> Now.
          </h1>
          <p className='text-xl text-center mt-4'>
            Start practicing your skills now in a fun and <br />
            interactive way with Quan C
          </p>
        </div>
      </div>
    </div>
  );
}

export default HookLanding;
