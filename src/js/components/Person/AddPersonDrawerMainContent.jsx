import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import arrayContains from '../../common/utils/arrayContains';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { getTeamMembersListByTeamId } from '../../models/TeamModel';
import makeRequestParams from '../../react-query/makeRequestParams';
import { useAddPersonToTeamMutation } from '../../react-query/mutations';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import AddPersonForm from './AddPersonForm';


const AddPersonDrawerMainContent = () => {
  renderLog('AddPersonDrawerMainContent');
  const { apiDataCache, getAppContextValue } = useConnectAppContext();
  const { allPeopleCache, allTeamsCache } = apiDataCache;
  const { mutate } = useAddPersonToTeamMutation();

  // const params  = useParams();
  // console.log('AddPersonDrawerMainContent params: ', params);

  const [addToTeamList, setAddToTeamList] = useState([]);
  const [allPeopleList, setAllPeopleList] = useState([]);
  const [remainingPeopleToAdd, setRemainingPeopleToAdd] = useState([]);
  const [searchResultsList, setSearchResultsList] = useState(undefined);
  const [thisTeamsCurrentMembersList, setThisTeamsCurrentMembersList] = useState([]);
  const [team] = useState(getAppContextValue('addPersonDrawerTeam'));
  const [teamMemberPersonIdList] = useState([]);
  const [matchingCountText, setMatchingCountText] = useState('');

  const searchStringRef = useRef('');

  const updateRemainingPeopleToAdd = () => {
    // console.log('initializeTheRemainingPeopleToAddListList in AddPersonDrawerMainContent');
    // Start with the passed in allPeopleList, create the remainingPeopleToAddList, by removing any people already on the team
    if (allPeopleList && allPeopleList.length > 0 && thisTeamsCurrentMembersList && thisTeamsCurrentMembersList.length >= 0) {
      const remainingPeopleToAddTemp = [];
      allPeopleList.forEach((onePerson) => {
        const isOnTeam = thisTeamsCurrentMembersList.some((obj) => obj.id === onePerson.personId);
        if (!isOnTeam) {
          remainingPeopleToAddTemp.push(onePerson);
        }
      });
      setRemainingPeopleToAdd(remainingPeopleToAddTemp);
    }
  };

  useEffect(() => {
    setAllPeopleList(Object.values(allPeopleCache));
  }, [allPeopleCache]);

  useEffect(() => {
    const teamId = team ? team.teamId : -1;
    if (teamId >= 0) {
      const teamMembersListTemp = getTeamMembersListByTeamId(teamId, apiDataCache);
      // console.log('useEffect in AddPersonDrawerMainContent teamMembersListTemp:', teamMembersListTemp);
      setThisTeamsCurrentMembersList(teamMembersListTemp);
    } else {
      console.log('useEffect in AddPersonDrawerMainContent teamId is -1, so no teamId');
    }
  }, [allPeopleCache, allPeopleList, allTeamsCache, team]);

  useEffect(() => {
    updateRemainingPeopleToAdd();
  }, [thisTeamsCurrentMembersList]);

  useEffect(() => {
    // TODO: Need to deal with preferred name searching and display, very possible but it will get more complicated
    let addToTeamListTemp = searchResultsList || remainingPeopleToAdd || [];
    addToTeamListTemp = addToTeamListTemp.filter((person) => person.firstName.length || person.lastName.length);
    setAddToTeamList(addToTeamListTemp);
  }, [searchResultsList, remainingPeopleToAdd]);

  useEffect(() => {
    // console.log('== INITIAL useEffect in AddPersonDrawerMainContent');
    if (allPeopleCache) {
      setAllPeopleList(Object.values(allPeopleCache));
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

  const addClicked = (incomingPerson) => {
    const personId = incomingPerson ? incomingPerson.personId : -1;
    const teamId = team ? team.teamId : -1;
    const teamName = team ? team.teamName : '';
    const plainParams = {
      personId,
      teamId,
      teamMemberFirstName: incomingPerson.firstName,
      teamMemberLastName: incomingPerson.lastName,
      teamName,
    };
    mutate(makeRequestParams(plainParams, {}));
    // Remove this person from the All People less Adds list (since they were added to the team)
    const updatedRemainingPeopleToAdd = remainingPeopleToAdd.filter((person) => person.personId !== incomingPerson.personId);
    setRemainingPeopleToAdd(updatedRemainingPeopleToAdd);
    if (searchResultsList && searchResultsList.length >= 0) {
      // also remove them from the searchResultsList if it exists
      const updatedSearchResultsList = searchResultsList.filter((person) => person.personId !== incomingPerson.personId);
      setSearchResultsList(updatedSearchResultsList);
      setMatchingCounter(updatedSearchResultsList);
    }
  };

  return (
    <AddPersonDrawerMainContentWrapper>
      {team && team.teamId >= 0 && (
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
      )}
      {(addToTeamList && addToTeamList.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonListTitle>{ searchResultsList ? 'Filtered list of people to add to team: ' : 'Can be added to team: '}</PersonListTitle>
          <PersonList>
            {addToTeamList.map((person) => (
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
