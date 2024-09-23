import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Error.css';

const Error = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate(); 

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className='flex flex-col items-center text-center mt-24 mb-24'>
      <h1 className='error-text-mobile text-cyan-100'>
        404
      </h1>
      <h1 className='error-desc-mobile text-white'>
        Page Not Found
      </h1>
      <div className="text-white mt-8">
        Will be redirected to home in {countdown}...
      </div>
    </div>
  );
}

export default Error;
