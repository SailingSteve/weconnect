import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../common/utils/logging';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import { useConnectAppContext, useConnectDispatch } from '../contexts/ConnectAppContext';
import capturePersonListRetrieveData from '../models/capturePersonListRetrieveData';
import { captureTeamListRetrieveData } from '../models/TeamModel';
import { METHOD, useFetchData } from '../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const Teams = ({ classes, match }) => {
  renderLog('Teams');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();
  const { apiDataCache } = useConnectAppContext();
  const { allPeopleCache, allTeamsCache } = apiDataCache;
  const dispatch = useConnectDispatch();

  const [showAllTeamMembers, setShowAllTeamMembers] = useState(true);
  const [teamList, setTeamList] = useState([]);

  const personListRetrieveResults = useFetchData(['person-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    // console.log('useFetchData person-list-retrieve in Teams useEffect:', personListRetrieveResults);
    if (personListRetrieveResults) {
      // console.log('In useEffect apiDataCache:', apiDataCache);
      // const changeResults =
      capturePersonListRetrieveData(personListRetrieveResults, apiDataCache, dispatch);
      // console.log('ConnectAppContext useEffect capturePersonListRetrieveData changeResults:', changeResults);
    }
  }, [personListRetrieveResults, allPeopleCache, dispatch]);

  const teamListRetrieveResults = useFetchData(['team-list-retrieve'], {}, METHOD.GET);
  // ///////////////////////////////////////////////////////
  // Steve's approach to use data directly from react-query
  // Requires using data directly from the specific API
  // Has the problem that we had discussed refactoring team-list-retrieve to not include person data,
  // so that team.teamMemberList would only include the personIds of team members, and not have the
  // teamMemberList data when we render <TeamMemberList below
  // const { data: dataTLR, isSuccess: isSuccessTLR, isFetching: isFetchingTLR } = teamListRetrieveResults;
  // useEffect(() => {
  //   // console.log('useFetchData team-list-retrieve in Teams useEffect:', dataTLR, isSuccessTLR, isFetchingTLR);
  //   // console.log('effect of useFetchData in Teams useEffect:', dataTLR, isSuccessTLR, isFetchingTLR);
  //   if (dataTLR !== undefined && isFetchingTLR === false) {
  //     console.log('effect of useFetchData in Teams useEffect dataTLR is good:', dataTLR, isSuccessTLR, isFetchingTLR);
  //     console.log('Successfully retrieved teams in Teams.jsx from dataTLR ...');
  //     const teamListTemp = dataTLR.teamList;
  //     setShowAllTeamMembers(true);
  //     // Do it both ways
  //     setTeamList(teamListTemp);
  //     setAppContextValue('teamListNested', teamListTemp);
  //     captureTeamListRetrieveData({ data: { teamList: teamListTemp }, isSuccess: isSuccessTLR }, apiDataCache, dispatch);
  //   } else {
  //     console.log('effect of useFetchData in Teams useEffect NO GO:', dataTLR, isSuccessTLR, isFetchingTLR);
  //   }
  // }, [dataTLR, isSuccessTLR]);

  // ////////////////////////////////////////////
  // Dale's approach to use organize incoming data and then use that data from apiDataCache
  // Allows us to organize incoming data independent of the specific API, potentially from multiple API or sources
  useEffect(() => {
    if (teamListRetrieveResults) {
      // TODO Consider making this usecaptureTeamListRetrieveData so we don't have to pass in the apiDataCache or dispatch
      captureTeamListRetrieveData(teamListRetrieveResults, apiDataCache, dispatch);
    }
  }, [teamListRetrieveResults, apiDataCache, dispatch]);

  useEffect(() => {
    if (allTeamsCache) {
      const teamListSimple = Object.values(allTeamsCache);
      setTeamList(teamListSimple);
    }
  }, [allPeopleCache, allTeamsCache]);

  const addTeamClick = () => {
    setAppContextValue('addTeamDrawerOpen', true);
    setAppContextValue('AddTeamDrawerLabel', 'Add Team');
  };

  useEffect(() => {
    const personProfile = getAppContextValue('personProfileDrawerOpen');
    if (personProfile === undefined) {
      setAppContextValue('personProfileDrawerOpen', false);
      setAppContextValue('addTeamDrawerOpen', false);
    }
  }, []);

  // const oneTeam = teamList.find((tm) => tm.teamId === 10);
  // console.log('teams render, team.length: ', teamList.length);
  // console.log('teams render, team 10, (cyclorama ) team name: ', oneTeam && oneTeam.teamName);
  return (
    <div>
      <Helmet>
        <title>
          Teams -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* Don't think we can do this anymore ... <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} /> */}
      </Helmet>
      <PageContentContainer>
        <h1>
          Teams
        </h1>
        <div>
          {showAllTeamMembers ? (
            <SpanWithLinkStyle onClick={() => setShowAllTeamMembers(false)}>hide people</SpanWithLinkStyle>
          ) : (
            <SpanWithLinkStyle onClick={() => setShowAllTeamMembers(true)}>show people</SpanWithLinkStyle>
          )}
        </div>
        {/* NOTE: we had discussed refactoring team-list-retrieve to not include person data, */}
        {/* so that team.teamMemberList would only include the personIds of team members */}
        {teamList.map((team, index) => (
          <OneTeamWrapper key={`team-${team.id}`}>
            <TeamHeader
              team={team}
              showHeaderLabels={(index === 0) && showAllTeamMembers && (team.teamMemberList && team.teamMemberList.length > 0)}
              showIcons
            />
            {showAllTeamMembers && (
              <>
                {/* DO NOT REMOVE PASSED IN team */}
                <TeamMemberList teamId={team.id} team={team} />
              </>
            )}
          </OneTeamWrapper>
        ))}
        <Button
          classes={{ root: classes.addTeamButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamClick}
          sx={{ marginTop: '30px' }}
        >
          Add Team
        </Button>
        <div style={{ padding: '100px 0 50px 0', fontWeight: '700' }}>
          <Link to="/login">
            Sign in
          </Link>
        </div>
      </PageContentContainer>
    </div>
  );
};
Teams.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
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

const OneTeamWrapper = styled('div')`
`;

export default withStyles(styles)(Teams);
