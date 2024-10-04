import React, { useEffect, useState } from 'react';
import DashboardContent from '../../components/DashboardContent/DashboardContent';
import Challenges from '../../components/Challenges/Challenges';
import Sidebar from '../../components/Sidebar/Sidebar'; // Import Sidebar
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../hook/actions/AuthAction';
import axios from 'axios';
import { ApiResponse } from '../../Interfaces/userInterfaces';
import AddChallenge from '../../components/AddChallenge/AddChallenge';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [username, setUsername] = useState('Admin');
  const [userRole, setUserRole] = useState('');

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <DashboardContent username={`${username}`} />;
        case 'Challenges':
          if(userRole === 'admin') {
            return <Challenges />;
          } else {
          return <DashboardContent username={`${username}`} />;
        }
        case 'Add Challenge':
          if(userRole === 'admin') {
            return <AddChallenge />;
          } else {
          return <DashboardContent username={`${username}`} />;
        }
        default:
        return <DashboardContent username={`${username}`} />;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);
        if (!token) return;
    
        const response = await axios.get<ApiResponse>(`${process.env.REACT_APP_API_BASE_URL}/getUserData`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
    
        const data = response.data.data;
        setUsername(data.login)
        setUserRole(data.app_data.role)
        
        dispatch(loginSuccess(data)); 

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [dispatch]);

  return (
    <div className="flex">
      <Sidebar 
        open={open}
        setOpen={setOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className={`p-7 duration-300 ${open ? 'ml-72' : 'ml-20'} w-full`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
