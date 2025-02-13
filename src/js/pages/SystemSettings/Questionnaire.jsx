import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { EditStyled } from '../../components/Style/iconStyles';
import { SpanWithLinkStyle } from '../../components/Style/linkStyles';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import webAppConfig from '../../config';
import { useConnectAppContext, useConnectDispatch } from '../../contexts/ConnectAppContext';
import { METHOD, useFetchData } from '../../react-query/WeConnectQuery';
import { captureQuestionListRetrieveData, captureQuestionnaireListRetrieveData, getQuestionsForQuestionnaire } from '../../models/QuestionnaireModel';


const Questionnaire = ({ classes }) => {
  renderLog('Questionnaire');
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();
  const { apiDataCache } = useConnectAppContext();
  const { allQuestionsCache, allQuestionnairesCache } = apiDataCache;
  const dispatch = useConnectDispatch();

  const [questionList, setQuestionList] = useState([]);
  const [questionnaire, setQuestionnaire] = useState(getAppContextValue('selectedQuestionnaire'));

  const targetQuestionnaireId = parseInt(useParams().questionnaireId, 10);

  const questionnaireListRetrieveResults = useFetchData(['questionnaire-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    // console.log('questionnaireListRetrieveResults in Questionnaire useEffect captureQuestionnaireListRetrieveData');
    if (questionnaireListRetrieveResults) {
      captureQuestionnaireListRetrieveData(questionnaireListRetrieveResults, apiDataCache, dispatch);
    }
  }, [questionnaireListRetrieveResults, allQuestionnairesCache]);

  const questionListRetrieveResults = useFetchData(['question-list-retrieve'], { questionnaireId: targetQuestionnaireId || '-1' }, METHOD.GET);
  useEffect(() => {
    // console.log('questionListRetrieveResults in Questionnaire useEffect captureQuestionListRetrieveData');
    if (questionListRetrieveResults) {
      captureQuestionListRetrieveData(questionListRetrieveResults, apiDataCache, dispatch);
    }
  }, [questionListRetrieveResults, allQuestionsCache]);

  useEffect(() => {
    // console.log('Questionnaire useEffect setQuestionnaire targetQuestionnaireId:', targetQuestionnaireId);
    if (allQuestionnairesCache) {
      if (targetQuestionnaireId && allQuestionnairesCache[targetQuestionnaireId]) {
        setQuestionnaire(allQuestionnairesCache[targetQuestionnaireId]);
      }
    }
  }, [allQuestionnairesCache]);

  useEffect(() => {
    // console.log('Questionnaire useEffect getQuestionsForQuestionnaire(targetQuestionnaireId):', targetQuestionnaireId);
    const questionsForCurrentQuestionnaire = getQuestionsForQuestionnaire(targetQuestionnaireId, allQuestionsCache) || [];
    if (questionsForCurrentQuestionnaire && questionsForCurrentQuestionnaire.length > 0) {
      setQuestionList(questionsForCurrentQuestionnaire);
    }
  }, [allQuestionsCache, targetQuestionnaireId]);

  const addQuestionClick = () => {
    setAppContextValue('editQuestionDrawerOpen', true);
    setAppContextValue('selectedQuestion', undefined);
    setAppContextValue('selectedQuestionnaire', questionnaire);
    setAppContextValue('editQuestionDrawerLabel', 'Add Question');
  };

  const editQuestionClick = (question) => {
    setAppContextValue('editQuestionDrawerOpen', true);
    setAppContextValue('selectedQuestion', question);
    setAppContextValue('selectedQuestionnaire', questionnaire);
    setAppContextValue('editQuestionDrawerLabel', 'Edit Question');
  };

  const editQuestionnaireClick = () => {
    setAppContextValue('editQuestionnaireDrawerOpen', true);
    setAppContextValue('selectedQuestionnaire', questionnaire);
    setAppContextValue('editQuestionnaireDrawerLabel', 'Edit Questionnaire');
  };

  return (
    <>
      <Helmet>
        <title>
          Questionnaire Details -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        {/* <link rel="canonical" href={`${webAppConfig.WECONNECT_URL_FOR_SEO}/questionnaire-question-list/${questionnaireIdTemp}`} /> */}
      </Helmet>
      <PageContentContainer>
        <QuestionnaireBreadcrumbWrapper>
          <Link to="/system-settings" style={{ height: '40px', fontSize: 'large' }} className="u-cursor--pointer u-link-color">
            Questionnaires
          </Link>
          {questionnaire && questionnaire.questionnaireId && (
            <>
              {' '}
              &gt;
              {' '}
              <QuestionnaireNameBreadcrumb>{questionnaire.questionnaireName}</QuestionnaireNameBreadcrumb>
              <SpanWithLinkStyle onClick={editQuestionnaireClick}>
                <EditStyled />
              </SpanWithLinkStyle>
            </>
          )}
        </QuestionnaireBreadcrumbWrapper>
        {questionnaire && questionnaire.questionnaireTitle && (
          <TitleWrapper>
            {questionnaire.questionnaireTitle}
          </TitleWrapper>
        )}
        {questionnaire && questionnaire.questionnaireInstructions && (
          <InstructionsWrapper>
            {questionnaire.questionnaireInstructions}
          </InstructionsWrapper>
        )}
        {(questionList && questionList.length > 0) ? (
          <QuestionListWrapper>
            {questionList.map((question) => (
              <OneQuestionnaireWrapper key={`questionnaire-${question.id}`}>
                {question.questionText}
                {' '}
                {question.requireAnswer && (
                  <RequiredStar> *</RequiredStar>
                )}
                <SpanWithLinkStyle onClick={() => editQuestionClick(question)}>
                  <EditStyled />
                </SpanWithLinkStyle>
              </OneQuestionnaireWrapper>
            ))}
          </QuestionListWrapper>
        ) : (
          <QuestionListWrapper>
            No Questions found for this questionnaire.
          </QuestionListWrapper>
        )}
        <AddButtonWrapper>
          <Button
            classes={{ root: classes.addQuestionnaireButtonRoot }}
            color="primary"
            variant="outlined"
            onClick={addQuestionClick}
          >
            Add Question
          </Button>
        </AddButtonWrapper>
      </PageContentContainer>
    </>
  );
};
Questionnaire.propTypes = {
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

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
`;

const QuestionnaireBreadcrumbWrapper = styled('div')`
  height: 100px;
  align-content: center;
`;

const OneQuestionnaireWrapper = styled('div')`
  margin-bottom: 20px;
`;

const QuestionListWrapper = styled('div')`
  margin-top: 24px;
  padding-bottom: 24px;
`;

const QuestionnaireNameBreadcrumb = styled('span')`
  padding: 0 20px 0 10px;
`;

const RequiredStar = styled('span')`
  color: ${DesignTokenColors.alert800};
  font-weight: bold;
`;

const TitleWrapper = styled('h1')`
  line-height: 1.1;
  margin-bottom: 8px;
`;

export default withStyles(styles)(Questionnaire);
