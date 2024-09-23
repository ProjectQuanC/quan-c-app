import React, { useCallback, useEffect, useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { loginSuccess, logout } from '../../store/features/auth/authActions';
import "./Navbar.css";
import { fetchData } from '../../utils/apiUtils';

interface GithubUserData {
  login?: string;
  id?: string;
  node_id?: string;
  avatar_url?: string;
  url?: string;
}

interface UserData {
  data: GithubUserData;
}

interface UserAccess {
  data: any;
  access_token: string;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<GithubUserData>({});
  const [codeParam, setCodeParam] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  
  // Redux state
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const navigations = [
    { name: "Home", redirect: "/" },
    { name: "FAQ", redirect: "/faq" },
    { name: "Collaborate With Us", redirect: "/collaborate" },
    { name: "Challenge List", redirect: "/challenge-list" },
  ];

  const getUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
      if (!token) return;

      const result = await fetchData<UserData>(`${process.env.REACT_APP_API_BASE_URL}/getUserData`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      setUserData(result.data);
      dispatch(loginSuccess(result));

    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [dispatch]);

  const getAccessToken = useCallback(async () => {
    if (!codeParam) return;

    try {
      const result = await fetchData<UserAccess>(`${process.env.REACT_APP_API_BASE_URL}/getAccessToken?code=${codeParam}`);
      if (result.access_token) {
        localStorage.setItem(`${process.env.REACT_APP_TOKEN_NAME}`, result.access_token);
        await getUserData();
      }
    } catch (error) {
      console.error('Failed to fetch access token:', error);
    }
  }, [codeParam, getUserData]);

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    if (token) {
      getUserData();
    } else {
      dispatch(logout());
    }
  }, [dispatch, getUserData]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlSearchParam = new URLSearchParams(queryString);
    setCodeParam(urlSearchParam.get("code"));

    if (codeParam) {
      getAccessToken();
    } else {
      checkAuthStatus();
    }
  }, [codeParam, getAccessToken, checkAuthStatus]);

  const handleLogin = () => {
    window.location.assign('https://github.com/login/oauth/authorize?client_id=' + process.env.REACT_APP_CLIENT_ID);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    navigate('/');
  };

  return (
    <nav className="bg-background-default p-4">
      <div className="container mx-auto flex justify-between items-center relative">
        <div className="text-white text-xl font-bold flex items-center padding-top-logo">
          <img src={`${process.env.PUBLIC_URL}/quan-c-logo.png`} alt="Brand Logo" className="h-8 mr-3" />
        </div>

        {isAuthenticated ? (
          <div className="xl:hidden absolute right-4 top-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <img src={userData?.avatar_url} alt={userData?.login} className="h-8 w-8 rounded-full" />
            </button>
          </div>
        ) : (
          <div className="absolute right-4 top-4 xl:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              {isOpen ? (
                <IoMdClose className="w-6 h-6" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        )}

        <div className="hidden xl:flex xl:items-center z-10">
          <ul className="flex space-x-4">
            {navigations.map((nav, index) => (
              <li key={index}>
                <Link
                  to={nav.redirect}
                  className={`px-3 py-2 rounded-md text-lg font-body ${
                    location.pathname === nav.redirect
                      ? 'text-cyan-100 underline'
                      : 'text-white hover:text-cyan-100 hover:underline'
                  }`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Authentication Button */}
          {isAuthenticated ? (
            <div className="flex items-center">
              <div className="relative">
                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="text-white bg-transparent focus:outline-none mt-1 ms-4">
                  <img src={userData?.avatar_url} alt={userData?.login} className="h-10 w-10 rounded-full mr-2" />
                </button>
                {isProfileDropdownOpen && (
                  <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <li>
                      <Link
                        to="/user-profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-cyan-100 hover:text-black"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        User Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-800 hover:bg-cyan-100 hover:text-black w-full text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="text-black bg-cyan-100 hover:opacity-50 px-3 py-2 rounded-md text-sm font-body ml-4 flex items-center"
            >
              <FaGithub className="me-2" />
              Login with GitHub
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-lg flex flex-col items-center justify-center">
          <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-white focus:outline-none">
            <IoMdClose className="w-8 h-8" />
          </button>
          <ul className="flex flex-col items-center space-y-6 text-2xl text-white">
            {navigations.map((nav, index) => (
              <li key={index}>
                <Link
                  to={nav.redirect}
                  onClick={() => setIsOpen(false)}
                  className={`${
                    location.pathname === nav.redirect
                      ? 'text-cyan-100 underline'
                      : 'text-white hover:text-cyan-100 hover:underline'
                  }`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}

            {/* Authentication Button for Mobile */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="mt-8 text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-lg font-body"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLogin();
                  setIsOpen(false);
                }}
                className="flex mt-8 text-black bg-cyan-100 hover:opacity-50 px-3 py-2 rounded-md text-lg font-body"
              >
                <FaGithub className="me-2 mt-1" />
                Login with GitHub
              </button>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;