import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import PersonSummaryRow from '../Person/PersonSummaryRow';
import {
  GetTeamMembersListByTeamId,
  // useGetTeamMembersListByTeamId,
} from '../../models/TeamModel';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';

const TeamMemberList = ({ teamId }) => { // teamMemberList
  renderLog('TeamMemberList');
  const { apiDataCache } = useConnectAppContext();
  const { allPeopleCache, allTeamsCache } = apiDataCache;
  // const [teamMemberList, setTeamMemberList] = useState(useGetTeamMembersListByTeamId(teamId));
  const [teamMemberList, setTeamMemberList] = useState([]);
  // const teamMemberList = useGetTeamMembersListByTeamId(teamId);
  // console.log('TeamMemberList teamMemberList:', teamMemberList);

  useEffect(() => {
    // console.log(`TeamMemberList useEffect teamId: ${teamId} apiDataCache:`, apiDataCache);
    const updatedTeamMemberList = GetTeamMembersListByTeamId(teamId, apiDataCache);
    // console.log(`TeamMemberList useEffect teamId: ${teamId} updatedTeamMemberList:`, updatedTeamMemberList);
    setTeamMemberList(updatedTeamMemberList);
  }, [allPeopleCache, allTeamsCache, teamId]);

  return (
    <TeamMembersWrapper>
      {teamMemberList.map((person, index) => {
        // console.log(`TeamMemberList teamId: ${teamId}, person:`, person);
        if (person) {
          return (
            <PersonSummaryRow
              key={`teamMember-${teamId}-${person.id}`}
              person={person}
              rowNumberForDisplay={index + 1}
              teamId={teamId}
            />
          );
        } else {
          return null; // Empty row for non-existing members
        }
      })}
    </TeamMembersWrapper>
  );
};
TeamMemberList.propTypes = {
  teamId: PropTypes.any.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamButtonRoot: {
    width: 120,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const TeamMembersWrapper = styled('div')`
`;

export default withStyles(styles)(TeamMemberList);
