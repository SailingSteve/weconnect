import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useConnectAppContext } from '../contexts/ConnectAppContext';

const PrivateRoute = () => {
  const { getAppContextValue } = useConnectAppContext();
  const isAuthenticated = getAppContextValue('isAuthenticated');
  console.log('========= PrivateRoute =========== isAuthenticated: ', isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
