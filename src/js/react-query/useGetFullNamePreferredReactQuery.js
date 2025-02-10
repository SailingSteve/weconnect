import { useState } from 'react';
import { useConnectAppContext } from '../contexts/ConnectAppContext';

// When the function name starts with 'use' React treats it as a custom hook, and it can then access Context variables
const useGetFullNamePreferredReactQuery = (person) => {
  const { getAppContextValue } = useConnectAppContext();
  const [allPeopleList] = useState(getAppContextValue('allPeopleList'));
  const [personId] = Object.values(person);  // This is silly, but this is a proof of concept
  const foundPerson = allPeopleList && allPeopleList.find((onePerson) => onePerson.id === parseInt(personId));
  let fullName = '';
  if (foundPerson?.id >= 0) {
    if (foundPerson?.firstNamePreferred) {
      fullName += foundPerson.firstNamePreferred;
    } else if (foundPerson?.firstName) {
      fullName += foundPerson.firstName;
    }
    if (fullName.length > 0 && foundPerson.lastName) {
      fullName += ' ';
    }
    if (foundPerson?.lastName) {
      fullName += foundPerson.lastName;
    }
  }
  return fullName;
};

export default useGetFullNamePreferredReactQuery;
