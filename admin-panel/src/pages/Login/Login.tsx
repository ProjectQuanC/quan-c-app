import React, { useEffect, useState } from 'react';
import { RootState } from '../../hook/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../../hook/actions/AuthAction';
import axios from 'axios';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add useNavigate
  const [codeParam, setCodeParam] = useState<string | null>(null);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const getAccessToken = async () => {
    if (!codeParam) return;

    console.log('GET ACCESS TOKEN');
    try {
      const url = process.env.REACT_APP_API_BASE_URL
      const response = await axios.get(`${url}/getAccessToken?code=` + codeParam, {
        method: 'GET',
      });
      console.log(response);
      if (!response) {
        throw new Error('Network response was not ok.');
      }
      const data = response.data;

      if (data.access_token) {
        localStorage.setItem('accessToken', data.access_token);
        dispatch(loginSuccess(response));

        // Redirect to the desired page after successful login
        navigate('/dashboard'); // Change "/dashboard" to your desired route
      }
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  };

  const handleLogin = () => {
    const redirectUri = 'http://localhost:3001/success';
    if (!isAuthenticated) {
      window.location.assign(
        `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`
      );
    } else {
      const queryString = window.location.search;
      const urlSearchParam = new URLSearchParams(queryString);
      setCodeParam(urlSearchParam.get('code'));
      if (codeParam) {
        getAccessToken();
      }
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlSearchParam = new URLSearchParams(queryString);
    setCodeParam(urlSearchParam.get('code'));

    if (codeParam) {
      getAccessToken();
    }
  }, [codeParam]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="w-full max-w-md rounded-lg shadow-md overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <div className="px-6 py-8">
          <div className="flex justify-center mb-6 p-4">
            <img
              src={`${process.env.PUBLIC_URL}/quan-c-logo-white.png`}
              alt="Quan C Logo"
              className="w-[60%]"
            />
          </div>
          <h2 className="text-2xl text-center text-white mb-8">Admin Panel</h2>
          <button
            onClick={handleLogin}
            className="w-full bg-gray-700 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                clipRule="evenodd"
              />
            </svg>
            Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
