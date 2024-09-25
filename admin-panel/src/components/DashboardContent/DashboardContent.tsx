import React from 'react';

interface DashboardContentProps {
  username: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ username }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img
        src={`${process.env.PUBLIC_URL}/quan-c-logo-black.png`}
        alt="Quan C Logo"
        className="w-[30%] mb-6"
      />
      <h1 className="text-4xl font-bold text-gray-800">Welcome to Quan C Admin Panel</h1>
      {username !== "Admin" && (
        <p className="text-lg text-gray-600">Hello, {username}!</p>
      )}
    </div>
  );
};

export default DashboardContent;
