import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { getTeamMembersListByTeamId } from '../../models/TeamModel';
import { METHOD, useFetchData } from '../../react-query/WeConnectQuery';
import PersonSummaryRow from '../Person/PersonSummaryRow';

// DO NOT REMOVE PASSED in TEAM
const TeamMemberList = ({ teamId, team }) => { // teamMemberList
  renderLog('TeamMemberList');
  const { apiDataCache } = useConnectAppContext();
  const { allPeopleCache, allTeamsCache } = apiDataCache;
  const [teamMemberListApiDataCache, setTeamMemberListApiDataCache] = useState([]);
  const [teamMemberListReactQuery, setTeamMemberListReactQuery] = useState(team.teamMemberList || []);
  // const teamMemberList = useGetTeamMembersListByTeamId(teamId);
  // console.log('TeamMemberList teamMemberList:', teamMemberList);

  const { data: dataTLR, isSuccess: isSuccessTLR, isFetching: isFetchingTLR } = useFetchData(['team-list-retrieve'], {}, METHOD.GET);
  console.log('useFetchData in TeamMemberList:', dataTLR, isSuccessTLR, isFetchingTLR);
  useEffect(() => {
    console.log('effect of useFetchData in TeamMemberList useEffect:', dataTLR, isSuccessTLR, isFetchingTLR);
    if (dataTLR !== undefined && isSuccessTLR) {
      const oneTeam = dataTLR.teamList.find((tm) => tm.teamId === parseInt(teamId));
      if (oneTeam) {  // We might have just deleted the team
        setTeamMemberListReactQuery(oneTeam.teamMemberList);
      }
    }
  }, [dataTLR, isSuccessTLR]);

  useEffect(() => {
    // console.log(`TeamMemberList useEffect teamId: ${teamId} apiDataCache:`, apiDataCache);
    const updatedTeamMemberList = getTeamMembersListByTeamId(teamId, apiDataCache);
    // console.log(`TeamMemberList useEffect teamId: ${teamId} updatedTeamMemberList:`, updatedTeamMemberList);
    setTeamMemberListApiDataCache(updatedTeamMemberList);
  }, [allPeopleCache, allTeamsCache, teamId]);

  // const oneTeam = teamList.find((tm) => tm.teamId === parseInt(teamId));
  console.log('Cached by ReactQuery teamMemberList: ', teamMemberListReactQuery);
  console.log('Cached by apiDataCache teamMemberList: ', teamMemberListApiDataCache);

  // DO NOT REMOVE: diffs the ReactQuery cache results with the ApiDataCache
  if (teamMemberListReactQuery && teamMemberListApiDataCache) {
    for (let i = 0; i < teamMemberListReactQuery.length; i++) {
      Object.keys(teamMemberListReactQuery[i]).forEach((key) => {
        if (key !== 'id' && !key.startsWith('date')) {
          const valReactQueryCache = teamMemberListReactQuery && teamMemberListReactQuery[i] && teamMemberListReactQuery[i][key];
          const valApiCacheQuery = teamMemberListApiDataCache && teamMemberListApiDataCache[i] && teamMemberListApiDataCache[i][key];
          if (valApiCacheQuery !== valReactQueryCache) {
            console.log(`ERROR: teamMemberList authoritative ReactQuery cache for key: ${key} value: '${valReactQueryCache}' does not match processed cache value: '${valApiCacheQuery}'`);
          }
        }
      });
    }
  }

  return (
    <TeamMembersWrapper>
      {teamMemberListReactQuery.map((person, index) => {
        if (teamId === 10) console.log(`TeamMemberList teamId: ${teamId}, person: ${person} location ${person.location}`);
        if (person) {
          return (
            <>
              <PersonSummaryRow
                key={`teamMember-${teamId}-${person.id}`}
                person={person}
                rowNumberForDisplay={index + 1}
                teamId={teamId}
              />
            </>
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
