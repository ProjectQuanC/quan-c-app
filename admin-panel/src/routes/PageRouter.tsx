import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import Success from '../pages/Success/Success';
import UpdateChallenge from '../pages/UpdateChallenge/UpdateChallenge';

const PageRouter = () => {

  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/success" element={<Success />} />
        <Route path="/update-challenge/:id" element={<UpdateChallenge />} />
      </Routes>
  );
};

export default PageRouter;
