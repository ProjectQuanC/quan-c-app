import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage/LandingPage';
import Error from '../pages/Error/Error';
import Faq from '../pages/Faq/Faq';
import Collaborate from '../pages/Collaborate/Collaborate';
import ChallengeList from '../pages/ChallengeList/ChallengeList';
import Profile from '../pages/Profile/Profile';
import Success from '../pages/Success/Success';
import Leaderboard from '../pages/Leaderboard/Leaderboard';
import AuthMiddleware from '../utils/AuthMiddleware';
import ChallengeDetail from '../pages/ChallengeDetail/ChallengeDetail';

const PageRouter = () => {
  return (
    <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/collaborate" element={<Collaborate />} />
      
      {/* Need Auth */}
      <Route path="/success" element={<Success />} />
      <Route path="/user-profile" element={<AuthMiddleware component={Profile} />} />
      <Route path="/leaderboard" element={<AuthMiddleware component={Leaderboard} />} />
      <Route path="/challenge-detail" element={<AuthMiddleware component={ChallengeDetail} />} />
      <Route path="/challenge-list" element={
        <Suspense fallback={<div>Loading...</div>}>
          <AuthMiddleware component={ChallengeList} />
        </Suspense>
      } />
    </Routes>
  );
};

export default PageRouter;
