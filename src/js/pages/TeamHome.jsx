import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import { renderLog } from '../common/utils/logging';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TeamHeader from '../components/Team/TeamHeader';
import TeamMemberList from '../components/Team/TeamMemberList';
import webAppConfig from '../config';
import { useConnectAppContext, useConnectDispatch } from '../contexts/ConnectAppContext';
import capturePersonListRetrieveData from '../models/capturePersonListRetrieveData';
import { captureTeamListRetrieveData, useGetTeamById } from '../models/TeamModel';
import { METHOD, useFetchData } from '../react-query/WeConnectQuery';
import convertToInteger from '../common/utils/convertToInteger';


const TeamHome = ({ classes }) => {
  renderLog('TeamHome');
  const { apiDataCache, setAppContextValue } = useConnectAppContext();
  const { allPeopleCache, allTeamsCache } = apiDataCache;
  const dispatch = useConnectDispatch();

  const params  = useParams();
  const [team, setTeam] = useState(useGetTeamById(convertToInteger(params.teamId)));
  const [teamId] = useState(convertToInteger(params.teamId));

  // const updateTeam = (tList) => {
  //   const oneTeam = tList.find((person) => person.teamId === parseInt(teamId));
  //   setTeam(oneTeam);
  // };

  // const isAddPersonDrawerOpen = document.getElementById('addPersonDrawer');

  const personListRetrieveResults = useFetchData(['person-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    if (personListRetrieveResults) {
      capturePersonListRetrieveData(personListRetrieveResults, apiDataCache, dispatch);
    }
  }, [personListRetrieveResults, allPeopleCache, dispatch]);

  const teamListRetrieveResults = useFetchData(['team-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    // console.log('useFetchData team-list-retrieve in TeamHome useEffect:', teamListRetrieveResults);
    if (teamListRetrieveResults) {
      // console.log('In useEffect apiDataCache:', apiDataCache);
      // const changeResults =
      captureTeamListRetrieveData(teamListRetrieveResults, apiDataCache, dispatch);
      // console.log('Teams useEffect changeResults:', changeResults);
    }
  }, [teamListRetrieveResults, allTeamsCache, dispatch]);

  useEffect(() => {
    // console.log('TeamHome teamId: ', teamId, ', allTeamsCache:', allTeamsCache);
    if (allTeamsCache && teamId && allTeamsCache[teamId]) {
      setTeam(allTeamsCache[teamId]);
    }
  }, [allTeamsCache, teamId]);

  const addTeamMemberClick = () => {
    // console.log('TeamHome addTeamMemberClick, teamId:', teamId);
    setAppContextValue('addPersonDrawerOpen', true);
    setAppContextValue('AddPersonDrawerLabel', 'Add Team Member');
    setAppContextValue('addPersonDrawerTeam', team);
  };

  return (
    <div>
      <Helmet>
        <title>
          Team Home -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* TODO 1/12/25: The following line might be reloading the app, consider using navigate() */}
        {/* <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/team-home`} /> */}
      </Helmet>
      <PageContentContainer>
        <h1>{team ? team.teamName : 'none'}</h1>
        <div>
          Team Home for
          {' '}
          {team ? team.teamName : 'none'}
          {' '}
          -
          {' '}
          <Link to="/teams">team list</Link>
        </div>
        {(teamId && team) && (
          <>
            <TeamHeader
              team={team}
              showHeaderLabels
              // showHeaderLabels={(teamMemberList && teamMemberList.length > 0)}
              showIcons={false}
            />
            {/* PLEASE DO NOT REMOVE PASSED team */}
            <TeamMemberList
              team={team}
              teamId={teamId}
            />
          </>
        )}
        <Button
          classes={{ root: classes.addTeamMemberButtonRoot }}
          color="primary"
          variant="outlined"
          onClick={addTeamMemberClick}
          sx={{ marginTop: '30px' }}
        >
          Add Team Member
        </Button>
      </PageContentContainer>
    </div>
  );
};
TeamHome.propTypes = {
  classes: PropTypes.object.isRequired,
  // params: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamMemberButtonRoot: {
    width: 180,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

// const TeamMember = styled('div')`
// `;

export default withStyles(styles)(TeamHome);
