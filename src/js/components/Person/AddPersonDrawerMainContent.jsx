import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import makeRequestParams from '../../react-query/makeRequestParams';
import { useAddPersonToTeamMutation } from '../../react-query/mutations';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import AddPersonForm from './AddPersonForm';


const AddPersonDrawerMainContent = () => {
  renderLog('AddPersonDrawerMainContent');
  const { apiDataCache, getAppContextValue } = useConnectAppContext();
  const { allPeopleCache } = apiDataCache;
  const { mutate } = useAddPersonToTeamMutation();

  // const params  = useParams();
  // console.log('AddPersonDrawerMainContent params: ', params);

  const [allPeopleList, setAllPeopleList] = useState([]);
  const [remainingPeopleToAdd, setRemainingPeopleToAdd] = useState([]);
  const [searchResultsList, setSearchResultsList] = useState(undefined);
  const [thisTeamsCurrentMembersList] = useState(getAppContextValue('addPersonDrawerTeamMemberList'));
  const [team] = useState(getAppContextValue('addPersonDrawerTeam'));
  const [teamMemberPersonIdList] = useState([]);
  const [matchingCountText, setMatchingCountText] = useState('');

  const searchStringRef = useRef('');

  const initializeRemainingPeopleToAddList = () => {
    // console.log('initializeTheRemainingPeopleToAddListList in AddPersonDrawerMainContent');
    // Start with the passed in allPeopleList, create the remainingPeopleToAddList, by removing any people already on the team
    if (allPeopleList && allPeopleList.length > 0) {
      const personToDisplay = [];
      allPeopleList.forEach((onePeople) => {
        const isOnTeam = thisTeamsCurrentMembersList.some((obj) => obj.id === onePeople.id);
        if (!isOnTeam) {
          personToDisplay.push(onePeople);
        }
      });
      setRemainingPeopleToAdd(personToDisplay);
    }
  };

  useEffect(() => {
    initializeRemainingPeopleToAddList();
  }, [apiDataCache]);

  useEffect(() => {
    initializeRemainingPeopleToAddList();
  }, [allPeopleList]);

  useEffect(() => {
    // console.log('useEffect in AddPersonDrawerMainContent allPeopleCache:', allPeopleCache);
    if (allPeopleCache) {
      setAllPeopleList(Object.values(allPeopleCache));
      setRemainingPeopleToAdd(Object.values(allPeopleCache));  // handles navigate to issues
    }
  }, []);

  const setMatchingCounter = (matchingElements) => {
    const matchingCount = matchingElements.length === 0 ? '' : `${matchingElements.length} matches out of ${remainingPeopleToAdd.length} people`;
    setMatchingCountText(matchingCount);
  };

  const searchFunction = () => {   // Now searches first and last name
    const currentValue = searchStringRef.current.value;
    if (currentValue.length === 0) {
      setMatchingCountText('');
      setSearchResultsList(undefined);
    } else {
      const isMatch = (element) => (element.lastName.toLowerCase().includes(currentValue.toLowerCase()) ||
          element.firstName.toLowerCase().includes(currentValue.toLowerCase()));
      const matchingElements = remainingPeopleToAdd ? remainingPeopleToAdd.filter((element) => isMatch(element)) : {};
      if (matchingElements && matchingElements.length) {
        setSearchResultsList(matchingElements);
        setMatchingCounter(matchingElements);
        // console.log(matchingElements);
      } else {
        setMatchingCountText('');
      }
    }
  };

  const addClicked = (person) => {
    const plainParams = {
      personId: person.id,
      teamId: team.teamId,
      teamMemberFirstName: person.firstName,
      teamMemberLastName: person.lastName,
      teamName: team.teamName,
    };
    mutate(makeRequestParams(plainParams, {}));
    // Remove this person from the All People less Adds list (since they were added to the team)
    const updatedRemainingPeopleToAdd = remainingPeopleToAdd.filter((person) => person.id !== person.id);
    setRemainingPeopleToAdd(updatedRemainingPeopleToAdd);
    if (searchResultsList && searchResultsList.length) {
      // also remove them from the searchResultsList if it exists
      const updatedSearchResultsList = searchResultsList.filter((person) => person.id !== person.id);
      setSearchResultsList(updatedSearchResultsList);
      setMatchingCounter(updatedSearchResultsList);
    }
  };

  // TODO: Need to deal with preferred name searching and display, very possible but it will get more complicated
  let displayList = searchResultsList || remainingPeopleToAdd || [];
  displayList = displayList.filter((person) => person.firstName.length || person.lastName.length);

  return (
    <AddPersonDrawerMainContentWrapper>
      <SearchBarWrapper>
        <TextField
          id="search_input"
          label="Search for team members"
          inputRef={searchStringRef}
          name="searchByName"
          onChange={searchFunction}
          placeholder="Search by name"
          defaultValue=""
          sx={{ minWidth: '250px' }}
        />
        <MatchingPerson>{matchingCountText}</MatchingPerson>
      </SearchBarWrapper>
      {(displayList && displayList.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonListTitle>{ searchResultsList ? 'Filtered list of people to add to team: ' : 'Can be added to team: '}</PersonListTitle>
          <PersonList>
            {displayList.map((person) => (
              <PersonItem key={`personResult-${person.id}`}>
                {person.firstName}
                {' '}
                {person.lastName}
                {!arrayContains(person.id, teamMemberPersonIdList) && (
                  <>
                    {' '}
                    <SpanWithLinkStyle onClick={() => addClicked(person)}>add</SpanWithLinkStyle>
                  </>
                )}
              </PersonItem>
            ))}
          </PersonList>
        </PersonSearchResultsWrapper>
      )}

      <AddPersonWrapper>
        <AddPersonForm />
      </AddPersonWrapper>
    </AddPersonDrawerMainContentWrapper>
  );
};

const AddPersonDrawerMainContentWrapper = styled('div')`
`;

const AddPersonWrapper = styled('div')`
  margin-top: 32px;
`;
const MatchingPerson = styled('div')`
  margin: 10px 0 0 10px;
  font-style: italic;
`;

// const PersonDirectoryWrapper = styled('div')`
//   margin-top: 16px;
// `;

const PersonItem = styled('div')`
`;

const PersonList = styled('div')`
`;

const PersonListTitle = styled('div')`
  font-weight: 250;
`;

const PersonSearchResultsWrapper = styled('div')`
  margin-top: 16px;
`;

const SearchBarWrapper = styled('div')`
  margin-bottom: 16px;
`;

export default AddPersonDrawerMainContent;
