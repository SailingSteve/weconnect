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
  const [allStaffLessAdds, setAllStaffLessAdds] = useState(getAppContextValue('allStaffList'));
  const [staffToDisplayList, setStaffToDisplayList] = useState([]);
  const [staffListLabelAdd, setStaffListLabelAdd] = useState(true);
  const [thisTeamsCurrentMembersList, setThisTeamsCurrentMembersList] = useState([]);
  const [teamId, setTeamId] = useState(getAppContextValue('teamId'));
  const [teamName, setTeamName] = useState('');
  const [teamMemberPersonIdList] = useState([]);
  const [searchResultsList] = useState([]);
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

  const setTheAllStaffToDisplayList = () => {
    console.log('setTheAllStaffList in AddPersonDrawerMainContent');
    // Start with the passed in allStaffList, create the staffToDisplayList, by removing any staff already on the team
    if (allStaffList && allStaffList.length > 0) {
      const staffToDisplay = [];
      allStaffList.forEach((oneStaff) => {
        const isOnTeam = thisTeamsCurrentMembersList.some((obj) => obj.id === oneStaff.id);
        if (!isOnTeam) {
          staffToDisplay.push(oneStaff);
        }
      });
      setStaffToDisplayList(staffToDisplay);
    }
  };

  useEffect(() => {
    setAllStaffLessAdds(allStaffList);
    setTheAllStaffToDisplayList();
  }, [addPersonDrawerOpen]);

  const searchFunction = () => {
    // TODO:  This currently only searches for matches in the staff member's last name
    const currentValue = searchStringRef.current.value;
    if (currentValue.length === 0) {
      setMatchingCountText('');
      setTheAllStaffToDisplayList();
      setStaffListLabelAdd(true);
    } else {
      const isMatch = (element) => element.lastName.toLowerCase().includes(currentValue.toLowerCase());
      const matchingElements = staffToDisplayList ? staffToDisplayList.filter((element) => isMatch(element)) : {};
      setStaffToDisplayList(matchingElements);
      const matchingCount = matchingElements.length === 0 ? '' : `${matchingElements.length} matches out of ${allStaffList.length} staff members`;
      setMatchingCountText(matchingCount);
      setStaffListLabelAdd(false);
      console.log(matchingElements);
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
    const updatedAllStaffLessAdds = allStaffLessAdds.filter((staff) => staff.id !== person.id);
    setAllStaffLessAdds(updatedAllStaffLessAdds);
    if (staffToDisplayList && staffToDisplayList.length > 0) {
      // If we are currently showing filtered, remove this staff member from the filtered Staff To Display List
      const updatedStaffToDisplayList = staffToDisplayList.filter((staff) => staff.id !== person.id);
      setStaffToDisplayList(updatedStaffToDisplayList);
    }
  };

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
      {(searchResultsList && searchResultsList.length > 0) && (
        <PersonSearchResultsWrapper>
          <PersonListTitle>Search Results:</PersonListTitle>
          <PersonList>
            {searchResultsList.map((person) => (
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
      <PersonDirectoryWrapper>
        <PersonListTitle>{staffListLabelAdd ? 'Can be added to team' : 'Filtered list of people to add to team'}</PersonListTitle>
        <PersonList>
          {staffToDisplayList.map((person) => (
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
      </PersonDirectoryWrapper>
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

const PersonDirectoryWrapper = styled('div')`
  margin-top: 16px;
`;

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
