// Sidebar.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { BsArrowLeftShort } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { RiDashboardFill } from "react-icons/ri";
import { FaFileAlt } from "react-icons/fa";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../hook/actions/AuthAction';
import { useDispatch } from 'react-redux';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Define the menu items
  const menus = [
    { title: "Dashboard", icon: <RiDashboardFill /> },
    { title: "Challenges", icon: <FaFileAlt /> },
    { title: "Add Challenge", icon: <BsFileEarmarkPlusFill /> },
  ];

  const handleLogin = () => {
    const redirectUri = 'http://localhost:3001/success';
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
    setIsAuthenticated(!!token); // Set authenticated status based on token presence
  }, []);

  return (
    <div className={`bg-background-default h-screen p-5 pt-8 ${open ? 'w-72' : 'w-20'} duration-300 relative flex flex-col`}>
      {/* Toggle button for the sidebar */}
      <BsArrowLeftShort
        className={`bg-white text-background-default text-3xl rounded-full absolute -right-3 top-9 border border-background-default cursor-pointer ${!open && "rotate-180"}`}
        onClick={() => setOpen(!open)}
      />
      {/* Logo Section */}
      <div className="inline-flex mb-auto">
        <FaUser className="bg-blue-200 text-4xl p-2 rounded cursor-pointer block float-left" />
        <h1 className={`text-white origin-left mt-0.5 ms-4 font-extralight text-2xl ${!open && "scale-0"}`}>Quan C</h1>
      </div>

      {/* Menu Items */}
      <ul className='pt-12 flex-grow'>
        {menus.filter(menu => {
          // Show all menus for authenticated users, or just the dashboard for unauthenticated users
          return isAuthenticated || menu.title === "Dashboard";
        }).map((menu, index) => (
          <li
            key={index}
            className={`text-gray-300 text-sm flex items-center gap-4 cursor-pointer p-2 hover:bg-blue-200 rounded-md ${activeMenu === menu.title ? 'bg-blue-500' : ''}`} // Highlight selected menu
            onClick={() => setActiveMenu(menu.title)} // Set active menu on click
          >
            <span className='text-2xl block float-left'>
              {menu.icon}
            </span>
            <span className={`text-base font-medium flex-1 duration-200 ${!open && "hidden"}`}>
              {menu.title}
            </span>
          </li>
        ))}
      </ul>

      {/* Authentication Section at the bottom */}
      <div className="mt-auto">
        {isAuthenticated ? (
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md w-full mt-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full mt-2"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;