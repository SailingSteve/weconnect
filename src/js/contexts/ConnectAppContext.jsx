import PropTypes from 'prop-types';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import initialApiDataCache from '../models/initialApiDataCache';
// import capturePersonListRetrieveData from '../models/capturePersonListRetrieveData';
import { METHOD, useFetchData } from '../react-query/WeConnectQuery';
// import { getInitialGlobalPersonVariables, PersonListRetrieveDataCapture } from '../models/PersonModel';
// import { getInitialGlobalTaskVariables } from '../models/TaskModel';
// import { getInitialGlobalTeamVariables } from '../models/TeamModel';

// Replaces AppObservableStore.js
// Create the context
const ConnectAppContext = createContext({});
const ConnectDispatch = createContext(null);
// const initialCachedApiPersonVariables = getInitialGlobalPersonVariables();
// const initialCachedApiTaskVariables = getInitialGlobalTaskVariables();
// const initialCachedApiTeamVariables = getInitialGlobalTeamVariables();

function apiDataCacheReducer (apiDataCache, action) {
  let revisedApiDataCache = { ...apiDataCache };
  // console.log('^^^^^^^^ apiDataReducer called with key: ', action.key);
  switch (action.type) {
    case 'updateByKeyValue': {
      revisedApiDataCache = { ...revisedApiDataCache, [action.key]: action.value };
      return revisedApiDataCache;
    }
    default: {
      return revisedApiDataCache;
    }
  }
}

// const initialApiDataCache = {
//   ...initialCachedApiPersonVariables,
//   ...initialCachedApiTaskVariables,
//   ...initialCachedApiTeamVariables,
// };

// Create the provider component
// eslint-disable-next-line no-unused-vars
export const ConnectAppContextProvider = ({ children }) => {
  // console.log('initialization of ConnectAppContextProvider ===============');
  const [data, setData] = useState({});
  const [apiDataCache, dispatch] = useReducer(
    apiDataCacheReducer,
    initialApiDataCache(),
  );
  const setAppContextValue = (key, value) => {
    // console.log('------------ setAppContextValue ', key, ' : ',  value);
    setData((prevStore) => ({ ...prevStore, [key]: value }));
  };

  const getAppContextData = () => data;

  const getAppContextValue = (key) => {
    if (key in data) {
      return data[key];
    }
    return null;   // requesting the value for a key that was never set
  };

  const setAppContextValuesInBulk = (variableDict) => {
    const keysIn = Object.keys(variableDict);
    const values = Object.values(variableDict);
    for (let i = 0; i < keysIn.length; i++) {
      setData((prevStore) => ({ ...prevStore, [keysIn[i]]: values[i] }));
    }
  };

  // const { data: dataP, isSuccess: isSuccessP, isFetching: isFetchingP, isStale: isStaleP } = useFetchData(['person-list-retrieve'], {}, METHOD.GET);
  // const personListRetrieveResults = useFetchData(['person-list-retrieve'], {}, METHOD.GET);
  // This is not currently the right place to pass these values, but I'm saving these here for the next 30 days until we work out the correct place.
  // {
  //   cacheTime: 0,
  //   networkMode: 'no-cache', <-- This is not a solution, it just covers up some problem in our code, while disabling the biggest benefit of ReactQueries.
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  //   refetchInterval: 0,
  //   staleTime: 0,
  // }

  // Moved to root pages: Teams, TeamHome, etc.
  // useEffect(() => {
  //   // console.log('useFetchData person-list-retrieve in Teams useEffect:', personListRetrieveResults);
  //   if (personListRetrieveResults) {
  //     // console.log('In useEffect apiDataCache:', apiDataCache);
  //     // const changeResults =
  //     capturePersonListRetrieveData(personListRetrieveResults, apiDataCache, dispatch);
  //     // console.log('ConnectAppContext useEffect capturePersonListRetrieveData changeResults:', changeResults);
  //   }
  // }, [personListRetrieveResults]);

  // const { data: dataP, isSuccess: isSuccessP, isFetching: isFetchingP } = personListRetrieveResults;
  // useEffect(() => {
  //   // console.log('useFetchData in TeamHome (person-list-retrieve) useEffect:', dataP, isSuccessP, isFetchingP, isStaleP);
  //   if (isSuccessP) {
  //     // console.log('useFetchData in TeamHome (person-list-retrieve)useEffect data good:', dataP, isSuccessP, isFetchingP, isStaleP);
  //     setAppContextValue('allPeopleList', dataP ? dataP.personList : []);
  //     // console.log('ConnectAppContext useEffect allPeopleList fetched');
  //   }
  // }, [dataP, isSuccessP, isFetchingP]);

  // The following prints console log errors
  const { data: dataAuth, isSuccess: isSuccessAuth, isFetching: isFetchingAuth } = useFetchData(['get-auth'], {}, METHOD.POST);
  useEffect(() => {
    if (isSuccessAuth) {
      console.log('useFetchData in ConnectAppContext useEffect dataAuth good:', dataAuth, isSuccessAuth, isFetchingAuth);
      const { isAuthenticated } = dataAuth;
      setAppContextValue('authenticatedPerson', dataAuth.person);
      setAppContextValue('authenticatedPersonId', dataAuth.personId);
      setAppContextValue('isAuthenticated', isAuthenticated);
      setAppContextValue('loggedInPersonIsAdmin', dataAuth.loggedInPersonIsAdmin);

      console.log('=============== ConnectAppContextProvider ======= isAuthenticated: ', isAuthenticated, ' ===========');
    }
  }, [dataAuth, isSuccessAuth]);

  return (
    <ConnectAppContext.Provider value={{ apiDataCache, getAppContextData, setAppContextValue, getAppContextValue, setAppContextValuesInBulk }}>
      <ConnectDispatch.Provider value={dispatch}>
        {children}
      </ConnectDispatch.Provider>
    </ConnectAppContext.Provider>
  );
};
ConnectAppContextProvider.propTypes = {
  children: PropTypes.object,
};

export default ConnectAppContextProvider;
export function useConnectAppContext () {
  return useContext(ConnectAppContext);
}

export function useConnectDispatch () {
  return useContext(ConnectDispatch);
}
