import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import { useFetchData } from '../react-query/WeConnectQuery';
import { getInitialGlobalPersonVariables, PersonListRetrieveDataCapture } from '../models/PersonModel';
import { getInitialGlobalTaskVariables } from '../models/TaskModel';
import { getInitialGlobalTeamVariables } from '../models/TeamModel';

// Replaces AppObservableStore.js
// Create the context
const ConnectAppContext = createContext({});
const ConnectDispatch = createContext(null);
const initialCachedApiPersonVariables = getInitialGlobalPersonVariables();
const initialCachedApiTaskVariables = getInitialGlobalTaskVariables();
const initialCachedApiTeamVariables = getInitialGlobalTeamVariables();

function apiDataCacheReducer (apiDataCache, action) {
  let revisedApiDataCache = { ...apiDataCache };
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

const initialApiDataCache = {
  ...initialCachedApiPersonVariables,
  ...initialCachedApiTaskVariables,
  ...initialCachedApiTeamVariables,
};

// Create the provider component
// eslint-disable-next-line no-unused-vars
export const ConnectAppContextProvider = ({ children }) => {
  // console.log('initialization of ConnectAppContextProvider ===============');
  const [data, setData] = useState({});
  const [apiDataCache, dispatch] = useReducer(
    apiDataCacheReducer,
    initialApiDataCache,
  );
  const setAppContextValue = (key, value) => {
    // console.log('------------ setAppContextValue ', key, ' : ',  value);
    setData((prevStore) => ({ ...prevStore, [key]: value }));
  };

  const getAppContextData = () => data;

  const getAppContextValue = (key) => data[key];

  const setAppContextValuesInBulk = (variableDict) => {
    const keysIn = Object.keys(variableDict);
    const values = Object.values(variableDict);
    for (let i = 0; i < keysIn.length; i++) {
      setData((prevStore) => ({ ...prevStore, [keysIn[i]]: values[i] }));
    }
  };

  // const { data: dataP, isSuccess: isSuccessP, isFetching: isFetchingP, isStale: isStaleP } = useFetchData(['person-list-retrieve'], {});
  const personListRetrieveResults = useFetchData(['person-list-retrieve'], {});
  // This is not currently the right place to pass these values, but I'm saving these here for the next 30 days until we work out the correct place.
  // {
  //   cacheTime: 0,
  //   networkMode: 'no-cache',
  //   refetchOnMount: true,
  //   refetchOnWindowFocus: true,
  //   refetchInterval: 0,
  //   staleTime: 0,
  // }
  const { data: dataP, isSuccess: isSuccessP, isFetching: isFetchingP, isStale: isStaleP } = personListRetrieveResults;
  useEffect(() => {
    // console.log('useFetchData person-list-retrieve in Teams useEffect:', personListRetrieveResults);
    if (personListRetrieveResults) {
      // console.log('In useEffect apiDataCache:', apiDataCache);
      // const changeResults =
      PersonListRetrieveDataCapture(personListRetrieveResults, apiDataCache, dispatch);
      // console.log('ConnectAppContext useEffect PersonListRetrieveDataCapture changeResults:', changeResults);
    }
  }, [personListRetrieveResults]);

  useEffect(() => {
    // console.log('useFetchData in TeamHome (person-list-retrieve) useEffect:', dataP, isSuccessP, isFetchingP, isStaleP);
    if (isSuccessP) {
      // console.log('useFetchData in TeamHome (person-list-retrieve)useEffect data good:', dataP, isSuccessP, isFetchingP, isStaleP);
      setAppContextValue('allStaffList', dataP ? dataP.personList : []);
      // console.log('ConnectAppContext useEffect allStaffList fetched');
    }
  }, [dataP, isSuccessP, isFetchingP]);

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







// Replaces AppObservableStore.js
// export const ConnectAppContext = createContext({ value: undefined, loadValue: () => console.log('Default function') });
//
//
// // https://stackoverflow.com/questions/57819211/how-to-set-a-value-with-usecontext
// // eslint-disable-next-line react/prop-types
// export const WeProvider = ({ children }) => {
//   const [value, setAppContextValue] = useState(undefined);
//
//   return (
//     <ConnectAppContext.Provider
//       value={{
//         value,
//         loadAppContextValue: (currentValue) => {
//           setAppContextValue(currentValue);
//         },
//       }}
//     >
//       {children}
//     </ConnectAppContext.Provider>
//   );
// };
//
