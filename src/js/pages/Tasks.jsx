import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { renderLog } from '../common/utils/logging';
import PersonSummaryHeader from '../components/Person/PersonSummaryHeader';
import PersonSummaryRow from '../components/Person/PersonSummaryRow';
import { SpanWithLinkStyle } from '../components/Style/linkStyles';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import TaskListForPerson from '../components/Task/TaskListForPerson';
import webAppConfig from '../config';
import { useConnectAppContext, useConnectDispatch } from '../contexts/ConnectAppContext';
import { TaskStatusListRetrieveDataCapture } from '../models/TaskModel';
import { TeamListRetrieveDataCapture } from '../models/TeamModel';
import { useFetchData } from '../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const Tasks = ({ classes, match }) => {
  renderLog('Tasks');  // Set LOG_RENDER_EVENTS to log all renders
  const { apiDataCache } = useConnectAppContext();
  const { allPeopleCache, allTaskDefinitionsCache, allTasksCache } = apiDataCache;
  const dispatch = useConnectDispatch();

  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [taskListByPersonId, setTaskListByPersonId] = useState({});
  const [taskDefinitionList, setTaskDefinitionList] = useState([]);
  const [selectedPersonList, setSelectedPersonList] = useState([]);
  const [personIdsList, setPersonIdsList] = useState([]);

  const taskStatusListRetrieveResults = useFetchData(['task-status-list-retrieve'], { personIdList: personIdsList });
  useEffect(() => {
    if (taskStatusListRetrieveResults) {
      // const changeResults =
      TaskStatusListRetrieveDataCapture(taskStatusListRetrieveResults, apiDataCache, dispatch);
      // console.log('Tasks useEffect changeResults:', changeResults);
    }
  }, [personIdsList, taskStatusListRetrieveResults]);

  useEffect(() => {
    // console.log('Tasks useEffect allTaskDefinitionsCache:', allTaskDefinitionsCache);
    if (allTaskDefinitionsCache) {
      setTaskDefinitionList(Object.values(allTaskDefinitionsCache));
    }
  }, [allTaskDefinitionsCache]);

  const teamListRetrieveResults = useFetchData(['team-list-retrieve'], {});
  useEffect(() => {
    // console.log('useFetchData team-list-retrieve in Teams useEffect:', teamListRetrieveResults);
    if (teamListRetrieveResults) {
      // console.log('In useEffect apiDataCache:', apiDataCache);
      // const changeResults =
      TeamListRetrieveDataCapture(teamListRetrieveResults, apiDataCache, dispatch);
      // console.log('Teams useEffect changeResults:', changeResults);
    }
  }, [teamListRetrieveResults]);

  useEffect(() => {
    // console.log('Tasks useEffect allPeopleCache:', allPeopleCache);
    if (allPeopleCache) {
      const allCachedPeopleList = Object.values(allPeopleCache);
      setPersonIdsList(allCachedPeopleList.map((person) => person.personId));
      setSelectedPersonList(allCachedPeopleList);
    }
  }, [allPeopleCache]);

  useEffect(() => {
    const taskListByPersonIdTemp = {};
    if (allTasksCache) {
      Object.entries(allTasksCache).forEach(([personIdTemp, taskDictByDefinitionId]) => {
        taskListByPersonIdTemp[personIdTemp] = Object.values(taskDictByDefinitionId);
      });
    }
    setTaskListByPersonId(taskListByPersonIdTemp);
    // console.log('=== taskListByPersonIdTemp:', taskListByPersonIdTemp);
  }, [allTasksCache]);

  const teamId = 0;  // hack 1/15/25
  return (
    <div>
      <Helmet>
        <title>
          Tasks -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* Executing a link to a full url restarts the session, <Link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/tasks`} /> */}
        {/* Latest Helmet wont take a link or Link, <Link to="/team-home">Home</Link> */}
        {/* browser.js:38 Uncaught Invariant Violation: Only elements types base, body, head, html, link, meta, noscript, script, style, title, Symbol(react.fragment) are allowed. Helmet does not support rendering <[object Object]> elements. Refer to our API for more information. */}
      </Helmet>
      <PageContentContainer>
        <h1>Dashboard</h1>
        <div>
          {showCompletedTasks ? (
            <SpanWithLinkStyle onClick={() => setShowCompletedTasks(false)}>hide completed</SpanWithLinkStyle>
          ) : (
            <SpanWithLinkStyle onClick={() => setShowCompletedTasks(true)}>show completed</SpanWithLinkStyle>
          )}
        </div>
        <PersonSummaryHeader />
        {taskListByPersonId && selectedPersonList.map((person) => (
          <OneTeamWrapper key={`team-${person.personId}`}>
            <PersonSummaryRow person={person} teamId={teamId} />
            <TaskListForPerson
              personId={person.personId}
              showCompletedTasks={showCompletedTasks}
              taskDefinitionList={taskDefinitionList}
              taskListForPersonId={taskListByPersonId[person.personId] || []}
            />
          </OneTeamWrapper>
        ))}
      </PageContentContainer>
    </div>
  );
};
Tasks.propTypes = {
  classes: PropTypes.object.isRequired,
  // match: PropTypes.object.isRequired,
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

export default withStyles(styles)(Tasks);
