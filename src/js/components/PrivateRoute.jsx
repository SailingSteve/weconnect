import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { authLog } from '../common/utils/logging';
import { useConnectAppContext } from '../contexts/ConnectAppContext';

const PrivateRoute = () => {
  const { getAppContextValue } = useConnectAppContext();
  const isAuthenticated = getAppContextValue('isAuthenticated');
  authLog('========= PrivateRoute =========== isAuthenticated: ', isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
