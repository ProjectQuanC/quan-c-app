import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css';

const LoginSuccess = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate('/challenge-list');
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-center text-center mb-8 margin-success-mobile">
          <img
            src={`${process.env.PUBLIC_URL}/quan-c-footer.svg`}
            alt="Secure Device"
            className="w-[40%]"
          />
        </div>
        <h1 className="text-6xl font-bold text-green-400 mb-4">200</h1>
        <h2 className="text-2xl text-white mb-6">Successfully Logged In</h2>
        <p className="text-white text-lg">
          Redirecting to the challenge list in <span className="font-bold">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
}

export default LoginSuccess;