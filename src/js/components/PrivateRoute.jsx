import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { authLog } from '../common/utils/logging';
import { useConnectAppContext, useConnectDispatch } from '../contexts/ConnectAppContext';
import { METHOD, useFetchData } from '../react-query/WeConnectQuery';
import { captureAccessRightsData } from '../models/AuthModel';

const PrivateRoute = () => {
  const location = useLocation();
  const { apiDataCache, getAppContextValue } = useConnectAppContext();
  const dispatch = useConnectDispatch();

  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const { data: dataAuth, isSuccess: isSuccessAuth } = useFetchData(['get-auth'], {}, METHOD.POST);
  useEffect(() => {
    if (isSuccessAuth) {
      console.log('useFetchData in PrivateRoute useEffect dataAuth good:', dataAuth, isSuccessAuth);
      setIsAuthenticated(dataAuth.isAuthenticated);
      // setAppContextValue('loggedInPersonIsAdmin', dataAuth.loggedInPersonIsAdmin);
      captureAccessRightsData(dataAuth, isSuccessAuth, apiDataCache, dispatch);
      authLog('========= PrivateRoute =========== INNER isAuthenticated: ', dataAuth.isAuthenticated);
    }
  }, [dataAuth, isSuccessAuth]);

  const isAuth = getAppContextValue('isAuthenticated');

  authLog('========= PrivateRoute =========== OUTER isAuthenticated: ', isAuthenticated, ', isAuth: ', isAuth);

  if (isAuthenticated || isAuth || isAuthenticated !== false) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
