import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Success.css';

const Success = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the code parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const codeParam = queryParams.get('code');

  // Fetch access token using the code parameter
  const getAccessToken = useCallback(async () => {
    if (!codeParam) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/getAccessToken`, {
        params: {
          code: codeParam
        }
      });

      // Check if the access token is available in the response
      if (response.data.access_token) {
        localStorage.setItem(`${process.env.REACT_APP_TOKEN_NAME}`, response.data.access_token);
      }
    } catch (error) {
      console.error('Failed to fetch access token:', error);
    }
  }, [codeParam]);

  useEffect(() => {
    getAccessToken(); // Call the function to fetch the access token

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
  }, [getAccessToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-green-400 mb-4">200</h1>
        <h2 className="text-2xl text-white mb-6">Successfully Logged In</h2>
        <p className="text-white text-lg">
          Redirecting to the challenge list in <span className="font-bold">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
}

export default Success;
