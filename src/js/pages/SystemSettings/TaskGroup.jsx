import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { EditStyled } from '../../components/Style/iconStyles';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { METHOD, useFetchData } from '../../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const TaskGroup = ({ classes, match }) => {
  renderLog('TaskGroup');
  const { setAppContextValue } = useConnectAppContext();

  const location = useLocation();
  const [taskGroupId] = useState(parseInt(useParams().taskGroupId));
  // const [taskGroupFromContext] = useState(getAppContextValue('editTaskGroupDrawerTaskGroup'));
  const [taskGroupName] = useState(location.state.taskGroupName);
  const [taskGroup, setTaskGroup] = useState(undefined);

  const [taskDefinitionList, setTaskDefinitionList] = useState(undefined);

  const { data: dataTSL, isSuccess: isSuccessTSL, isFetching: isFetchingTSL } = useFetchData(['task-status-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    if (isSuccessTSL) {
      console.log('useFetchData in TeamHome (task-group-retrieve) useEffect data good:', dataTSL);
      // We don't need this list for this object, but extracting as an example for other objects
      // setTaskGroupList(dataTSL ? dataTSL.taskGroupList : {});
      setTaskDefinitionList(dataTSL ? dataTSL.taskDefinitionList : undefined);
      // We don't need this list for this object, but extracting as an example for other objects
      // setTaskList(dataTSL ? dataTSL.taskList : []);
      const oneGroup = dataTSL.taskGroupList.find((group) => parseInt(group.taskGroupId) === parseInt(taskGroupId));
      setTaskGroup(oneGroup);
    }
  }, [dataTSL, isSuccessTSL, isFetchingTSL]);


  const addTaskDefinitionClick = () => {
    setAppContextValue('editTaskDefinitionDrawerOpen', true);
    setAppContextValue('editTaskDefinitionDrawerTaskDefinitionId', -1);
    setAppContextValue('editTaskDefinitionDrawerTaskGroup', taskGroup);
    setAppContextValue('editTaskDefinitionDrawerLabel', 'Add Task');
  };

  const editTaskDefinitionClick = (taskDefinition) => {
    setAppContextValue('editTaskDefinitionDrawerOpen', true);
    setAppContextValue('editTaskDefinitionDrawerTaskDefinition', taskDefinition);
    setAppContextValue('editTaskDefinitionDrawerTaskGroup', taskGroup);
    setAppContextValue('editTaskDefinitionDrawerLabel', 'Edit Task');
  };

  const editTaskGroupClick = () => {
    // const { params } = match;
    // const taskGroupIdTemp = convertToInteger(params.taskGroupId);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerOpen', true);
    // AppObservableStore.setGlobalVariableState('editTaskGroupDrawerTaskGroupId', taskGroupIdTemp);
  };

  return (
    <>
      <Helmet>
        <title>
          TaskGroup Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/task-group/${taskGroupId}`} />
      </Helmet>
      <PageContentContainer>
        <TaskGroupTitleWrapper>
          <Link to="/system-settings">Task Groups</Link>
          {' '}
          &gt;
          {' '}
          {taskGroupName}
          <SpanWithLinkStyle onClick={editTaskGroupClick}>
            <EditStyled />
          </SpanWithLinkStyle>
        </TaskGroupTitleWrapper>
        {taskGroup && taskGroup.taskGroupDescription && (
          <InstructionsWrapper>
            {taskGroup.taskGroupDescription}
          </InstructionsWrapper>
        )}
        <TaskDefinitionListWrapper>
          {taskDefinitionList && taskDefinitionList.map((taskDefinition) => (
            <OneTaskGroupWrapper key={`taskDefinition-${taskDefinition.id}`}>
              {taskDefinition.taskName}
              {' '}
              <SpanWithLinkStyle onClick={() => editTaskDefinitionClick(taskDefinition)}>
                <EditStyled />
              </SpanWithLinkStyle>
            </OneTaskGroupWrapper>
          ))}
        </TaskDefinitionListWrapper>
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addTaskGroupButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addTaskDefinitionClick}
          >
            Add Task
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </>
  );
};
TaskGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTaskGroupButtonRoot: {
    width: 185,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const TaskGroupTitleWrapper = styled('div')`
  height: 100px;
  align-content: center;
`;

const AddButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
`;

const OneTaskGroupWrapper = styled('div')`
  margin-bottom: 20px;
`;

const TaskDefinitionListWrapper = styled('div')`
  margin-top: 24px;
  padding-bottom: 24px;
`;

export default withStyles(styles)(TaskGroup);
