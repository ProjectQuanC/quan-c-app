import React from 'react';
import LandingPage from '../pages/LandingPage/LandingPage';

type AuthMiddlewareProps = {
  component: React.ComponentType;
};

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ component: Component }) => {
  const token = localStorage.getItem(`${process.env.REACT_APP_TOKEN_NAME}`);

  if (!token) {
    return <LandingPage />;
  }

  return <Component />;
};

export default AuthMiddleware;
