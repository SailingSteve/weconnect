import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { EditStyled } from '../../components/Style/iconStyles';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { useFetchData } from '../../react-query/WeConnectQuery';


const SystemSettings = ({ classes }) => {
  renderLog('SystemSettings');
  const { setAppContextValue } = useConnectAppContext();

  const [questionnaireList, setQuestionnaireList] = useState([]);
  const [taskGroupList, setTaskGroupList] = useState([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: dataQList, isFetching: isFetchingQList, isSuccess: isSuccessQList } = useFetchData(['questionnaire-list-retrieve'], {});
  if (isFetchingQList) {
    console.log('isFetching questionnaire-list-retrieve ------------');
  }
  useEffect(() => {
    if (dataQList !== undefined && isFetchingQList === false) {
      const questionnaireListTemp = dataQList.questionnaireList;
      setQuestionnaireList(questionnaireListTemp);
    }
  }, [dataQList, isSuccessQList]);

  const { data: dataGroupList, isFetching: isFetchingGroupList, isSuccess: isSuccessGroupList } = useFetchData(['task-group-list-retrieve'], {});
  if (isFetchingGroupList) {
    console.log('isFetching task-group-retrieve ------------');
  }
  useEffect(() => {
    if (dataGroupList !== undefined && isFetchingGroupList === false) {
      const taskListTemp = dataGroupList.taskGroupList;
      setTaskGroupList(taskListTemp);
    }
  }, [dataGroupList, isSuccessGroupList]);

  const addQuestionnaireClick = () => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('selectedQuestionnaire', undefined);
  };

  const editQuestionnaireClick = (questionnaire) => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('selectedQuestionnaire', questionnaire);
  };

  const addTaskGroupClick = () => {
    setAppContextValue('editTaskGroupDrawerOpen', true);
    setAppContextValue('editTaskGroupDrawerTaskGroup', undefined);
  };

  const editTaskGroupClick = (taskGroup) => {
    setAppContextValue('editTaskGroupDrawerOpen', true);
    setAppContextValue('editTaskGroupDrawerTaskGroup', taskGroup);
  };

  const goToQuestionnairePageClick = (questionnaire) => {
    setAppContextValue('selectedQuestionnaire', questionnaire);

    queryClient.invalidateQueries(['question-list-retrieve']).then(() => {});
    // console.log('goToQuestionnairePageClick = (questionnaire)', questionnaire.questionnaireId);

    navigate(`/questionnaire/${questionnaire.questionnaireId}`);
  };

  return (
    <div>
      <Helmet>
        <title>
          System Settings -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/system-settings`} />
      </Helmet>
      <PageContentContainer>
        <h1>
          System Settings
        </h1>
        {/* ****  **** */}
        <SettingsSubtitle>Questionnaires</SettingsSubtitle>
        {questionnaireList.map((questionnaire) => (
          <OneQuestionnaireWrapper key={`questionnaire-${questionnaire.questionnaireId}`}>
            <QuestionnaireInnerWrapper>
              {/* {console.log('questionnaireList.map((questionnaire)', questionnaire.questionnaireId)} */}
              <GoToQuestionairePage onClick={() => goToQuestionnairePageClick(questionnaire)}>
                <SpanWithLinkStyle>
                  {questionnaire.questionnaireName}
                </SpanWithLinkStyle>
              </GoToQuestionairePage>
              <EditQuestionnaire onClick={() => editQuestionnaireClick(questionnaire)}>
                <EditStyled />
              </EditQuestionnaire>
            </QuestionnaireInnerWrapper>
          </OneQuestionnaireWrapper>
        ))}
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addQuestionnaireButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addQuestionnaireClick}
          >
            Add Questionnaire
          </Button>
        </AddButtonWrapper>
        {/* ****  **** */}
        <SettingsSubtitle>Onboarding Task Groupings</SettingsSubtitle>
        {taskGroupList.map((taskGroup) => (
          <OneQuestionnaireWrapper key={`taskGroup-${taskGroup.id}`}>
            <QuestionnaireInnerWrapper>
              <Link to={`/task-group/${taskGroup.id}`} state={taskGroup}>
                {taskGroup.taskGroupName}
              </Link>
              <EditTaskGroup onClick={() => editTaskGroupClick(taskGroup)}>
                <EditStyled />
              </EditTaskGroup>
            </QuestionnaireInnerWrapper>
          </OneQuestionnaireWrapper>
        ))}
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addQuestionnaireButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addTaskGroupClick}
          >
            Add Task Grouping
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </div>
  );
};
SystemSettings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addQuestionnaireButtonRoot: {
    width: 185,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AddButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const EditQuestionnaire = styled('div')`
  margin-left: 25px;
`;

const EditTaskGroup = styled('div')`
  margin-left: 25px;
`;

const GoToQuestionairePage = styled('div')`
`;

const OneQuestionnaireWrapper = styled('div')`
`;

const QuestionnaireInnerWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 6px;
`;

const SettingsSubtitle = styled('h2')`
`;

export default withStyles(styles)(SystemSettings);
