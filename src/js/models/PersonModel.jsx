import isEqual from 'lodash-es/isEqual';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn from '../react-query/WeConnectQuery';
import { useConnectAppContext } from '../contexts/ConnectAppContext';

// These are the "AppContextValues" (i.e., global state variables) used in the PersonModel
export function getInitialGlobalPersonVariables () {
  return {
    allPeopleCache: {}, // This is a dictionary key: personId, value: person dict
    mostRecentPersonIdSaved: -1,
    mostRecentPersonSaved: {
      firstName: '',
      lastName: '',
      personId: '',
    },
    searchResults: [],
  };
}

export const useGetPersonById = (personId) => {
  const { apiDataCache } = useConnectAppContext();
  const { allPeopleCache } = apiDataCache;
  // console.log('useGetPersonById personId:', personId, ', allPeopleCache:', allPeopleCache);
  if (allPeopleCache) {
    return allPeopleCache[personId] || {};
  } else {
    return {};
  }
};

export const useGetFullNamePreferred = (personId) => {
  const person = useGetPersonById(personId);
  let fullName = '';
  if (person.id >= 0) {
    if (person.firstNamePreferred) {
      fullName += person.firstNamePreferred;
    } else if (person.firstName) {
      fullName += person.firstName;
    }
    if (fullName.length > 0 && person.lastName) {
      fullName += ' ';
    }
    if (person.lastName) {
      fullName += person.lastName;
    }
  }
  return fullName;
};

export function PersonListRetrieveDataCapture (incomingResults = {}, apiDataCache = {}, dispatch) {
  const { data, isSuccess } = incomingResults;
  const allPeopleCache = apiDataCache.allPeopleCache || {};
  let changeResults = {
    allPeopleCache,
    allPeopleCacheChanged: false,
  };
  const allPeopleCacheNew = { ...allPeopleCache };
  // console.log('PersonListRetrieve data: ', data, ', isFetching:', isFetching, ', isSuccess:', isSuccess);
  // We need to only update allPeopleCache the first time we have received new data from the API server
  if (data && data.personList && isSuccess === true) {
    let newDataReceived = false;
    data.personList.forEach((person) => {
      if (person && person.personId && person.personId >= 0) {
        if (!allPeopleCacheNew[person.personId]) {
          allPeopleCacheNew[person.personId] = person;
          newDataReceived = true;
        } else if (!isEqual(person, allPeopleCacheNew[person.personId])) {
          allPeopleCacheNew[person.personId] = person;
          newDataReceived = true;
        }
      }
    });
    // console.log('person-list-retrieve setting allPeopleCacheNew:', allPeopleCacheNew, ', newDataReceived:', newDataReceived);
    if (newDataReceived) {
      // setAppContextValue('allPeopleCache', allPeopleCache);
      dispatch({ type: 'updateByKeyValue', key: 'allPeopleCache', value: allPeopleCacheNew });
      changeResults = {
        allPeopleCache: allPeopleCacheNew,
        allPeopleCacheChanged: true,
      };
    }
  }
  return changeResults;
}

export const usePersonSave = () => {
  // PLEASE DO NOT REMOVE
  // const { apiDataCache } = useConnectAppContext();
  // const dispatch = useConnectDispatch();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('person-save', params),
    networkMode: 'always', // Send queries to the server even if the cache has the data
    onError: (error) => {
      console.log('onError in usePersonSave: ', error);
      queryClient.refetchQueries({ queryKey: ['person-list-retrieve'], refetchType: 'active', exact: true, force: true })
        .then(() => console.log('PersonModel API call error recovery refetch completed'))
        .catch((error2) => console.error('PersonModel API call refetch failed:', error2));
    },
    onSuccess: (results) => {
      // console.log('person-save onSuccess true, results: ', results);

      // PLEASE DO NOT REMOVE
      // const { allPeopleCache } = apiDataCache;
      // const allPeopleCacheNew = { ...allPeopleCache };
      // console.log('useGetPersonById personId:', personId, ', allPeopleCacheNew:', allPeopleCacheNew);
      if (results.success === false) {
        console.log('usePersonSave onSuccess failed results:', results);
      } else if (results.personId >= 0) {
        // PLEASE DO NOT REMOVE
        // console.log('usePersonSave personId:', results.personId, ', results: ', results);
        // allPeopleCacheNew[results.personId] = results;
        // dispatch({ type: 'updateByKeyValue', key: 'allPeopleCache', value: allPeopleCacheNew });

        // setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ['person-list-retrieve'], refetchType: 'active', exact: true, force: true })
          .then(() => console.log('PersonModel refetch completed'))
          .catch((error) => console.error('PersonModel refetch failed:', error));
        // }, 1000);  // 1 second delay
      } else {
        console.log('usePersonSave personId not >= 0:', results);
      }
    },
  });
};
