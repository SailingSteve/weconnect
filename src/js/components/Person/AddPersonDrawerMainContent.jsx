import { TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
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
  const { getAppContextValue } = useConnectAppContext();
  const { mutate } = useAddPersonToTeamMutation();

  const params  = useParams();
  console.log('AddPersonDrawerMainContent params: ', params);

  const [allStaffList] = useState(getAppContextValue('allStaffList'));
  const [remainingStaffToAdd, setRemainingStaffToAdd] = useState(getAppContextValue('allStaffList'));
  const [searchResultsList, setSearchResultsList] = useState(undefined);
  const [thisTeamsCurrentMembersList, setThisTeamsCurrentMembersList] = useState([]);
  const [teamId, setTeamId] = useState(getAppContextValue('teamId'));
  const [teamName, setTeamName] = useState('');
  const [teamMemberPersonIdList] = useState([]);
  const [matchingCountText, setMatchingCountText] = useState('');
  const [addPersonDrawerOpen] = useState(getAppContextValue('addPersonDrawerOpen'));

  const searchStringRef = useRef('');

  let memberList = [];
  const teamListFromContext = getAppContextValue('teamListNested');
  if (teamListFromContext  && thisTeamsCurrentMembersList.length === 0 && teamName === '') {
    const oneTeam = teamListFromContext.find((team) => team.id === parseInt(teamId));
    setTeamName(oneTeam.teamName);
    setTeamId(oneTeam.id);

    if (oneTeam && oneTeam.teamMemberList.length > 0) {
      memberList = oneTeam.teamMemberList;
      setThisTeamsCurrentMembersList(memberList);
    }
  } else {
    // console.log('no teamListFromContext yet!');
  }

  const initializeRemainingStaffToAddList = () => {
    console.log('initializeTheRemainingStaffToAddListList in AddPersonDrawerMainContent');
    // Start with the passed in allStaffList, create the remainingStaffToAddList, by removing any staff already on the team
    if (allStaffList && allStaffList.length > 0) {
      const staffToDisplay = [];
      allStaffList.forEach((oneStaff) => {
        const isOnTeam = thisTeamsCurrentMembersList.some((obj) => obj.id === oneStaff.id);
        if (!isOnTeam) {
          staffToDisplay.push(oneStaff);
        }
      });
      setRemainingStaffToAdd(staffToDisplay);
    }
  };

  useEffect(() => {
    setRemainingStaffToAdd(allStaffList);  // handles navigate to issues
    initializeRemainingStaffToAddList();
  }, [addPersonDrawerOpen]);

  const setMatchingCounter = (matchingElements) => {
    const matchingCount = matchingElements.length === 0 ? '' : `${matchingElements.length} matches out of ${remainingStaffToAdd.length} staff members`;
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
      const matchingElements = remainingStaffToAdd ? remainingStaffToAdd.filter((element) => isMatch(element)) : {};
      if (matchingElements && matchingElements.length) {
        setSearchResultsList(matchingElements);
        setMatchingCounter(matchingElements);
        console.log(matchingElements);
      } else {
        setMatchingCountText('');
      }
    }
  };

  const addClicked = (person) => {
    const plainParams = {
      personId: person.id,
      teamId,
      teamMemberFirstName: person.firstName,
      teamMemberLastName: person.lastName,
      teamName,
    };
    mutate(makeRequestParams(plainParams, {}));
    // Remove this staff from the All Staff less Adds list (since they were added to the team)
    const updatedRemainingStaffToAdd = remainingStaffToAdd.filter((staff) => staff.id !== person.id);
    setRemainingStaffToAdd(updatedRemainingStaffToAdd);
    if (searchResultsList && searchResultsList.length) {
      // also remove them from the searchResultsList if it exists
      const updatedSearchResultsList = searchResultsList.filter((staff) => staff.id !== person.id);
      setSearchResultsList(updatedSearchResultsList);
      setMatchingCounter(updatedSearchResultsList);
    }
  };

  const displayList = searchResultsList || remainingStaffToAdd || [];
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
