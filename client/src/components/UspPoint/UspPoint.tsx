import React from 'react';
import "./UspPoint.css";

interface UspPointProps {
  name: string;
  desc_1: string;
  desc_2: string;
  icon: React.ReactNode;
  class_script: string;
}

const UspPoint: React.FC<UspPointProps> = ({ name, desc_1, desc_2, icon, class_script }) => {
  return (
    <div className='flex text-white'>
      <div className={class_script}>
        {icon}
      </div>
      <div className="ms-4">
        <h3 className="heading-mobile font-bold">{name}</h3>
        <p className="text-base">{desc_1} <br /> {desc_2} </p>
      </div>
    </div>
  );
};

export default UspPoint;
