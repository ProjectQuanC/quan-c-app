import React from 'react';
import UspPoint from '../UspPoint/UspPoint';
import { FaBookOpen, FaHandPaper } from "react-icons/fa";
import { BsFillPeopleFill } from "react-icons/bs";
import "./Usp.css";

const Usp = () => {

  const usp_elements = [
    {
      name: "Hands-on Experience",
      desc_1: "Learn to build secure code",
      desc_2: "by hands-on experience",
      icon: <FaHandPaper />,
      class_script: "icon-mobile bg-blue-550 shadow-md text-cyan-100 rounded-mobile"
    },
    {
      name: "Easy to Learn",
      desc_1: "Every case is provided",
      desc_2: "with guidance and resources",
      icon: <FaBookOpen />,
      class_script: "icon-mobile bg-blue-550 shadow-md text-cyan-100 mobile-point rounded-mobile"
    },
    {
      name: "Community Based",
      desc_1: "Collaborate with developers by",
      desc_2: "giving case recommendations",
      icon: <BsFillPeopleFill />,
      class_script: "icon-mobile bg-blue-550 shadow-md text-cyan-100 mobile-point rounded-mobile"
    }
  ];

  const heading = (
    <h1 className='text-mobile center-mobile mb-8'>
      Your <span className='text-cyan-100'> Best Partner </span> to <br /> Learn Secure Programming.
    </h1>
  );

  const desc = (
    <p className='text-base center-mobile description-text'>
      Quan C is your interactive platform designed to <br />
      make learning secure programming practices <br />
      fun, engaging, and effective.
    </p>
  );

  return (
    <div className='margin-mobile'>
      <div className="text-white">
        {heading}
        {desc}
      </div>
      <div className="flex mt-8 flex-mobile gap-4">
        {usp_elements.map((usp, index) => (
          <UspPoint 
            key={index}
            name={usp.name}
            desc_1={usp.desc_1}
            desc_2={usp.desc_2}
            icon={usp.icon}
            class_script={usp.class_script}
          />
        ))}
      </div>
    </div>
  );
};

export default Usp;