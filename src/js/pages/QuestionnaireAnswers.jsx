import { FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import styled from 'styled-components';
import DesignTokenColors from '../common/components/Style/DesignTokenColors';
import { renderLog } from '../common/utils/logging';
import { PageContentContainer } from '../components/Style/pageLayoutStyles';
import webAppConfig from '../config';
import { useConnectAppContext, useConnectDispatch } from '../contexts/ConnectAppContext';
import { useGetFullNamePreferred } from '../models/PersonModel'; // capturePersonRetrieveData
import { captureQuestionListRetrieveData } from '../models/QuestionnaireModel';
import { METHOD, useFetchData } from '../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const QuestionnaireAnswers = ({ classes }) => {
  renderLog('QuestionnaireAnswers');
  const { apiDataCache } = useConnectAppContext();
  const { allQuestionsCache } = apiDataCache;
  const dispatch = useConnectDispatch();

  const [personId] = useState(parseInt(useParams().personId));
  const [questionList, setQuestionList] = useState(undefined);
  const [questionnaire] = useState({});
  const [questionnaireId] = useState(parseInt(useParams().questionnaireId));

  const questionListRetrieveResults = useFetchData(['question-list-retrieve'], { questionnaireId: questionnaireId || '-1' }, METHOD.GET);
  useEffect(() => {
    if (questionListRetrieveResults) {
      captureQuestionListRetrieveData(questionListRetrieveResults, apiDataCache, dispatch);
    }
  }, [questionListRetrieveResults, allQuestionsCache]);

  const getAnswerValue = (questionId) => {
    // if (allAnswersCache && allAnswersCache[questionId]) {
    //   const questionAnswer = allAnswersCache[questionId];
    //   return getAnswerValueFromAnswerDict(questionAnswer);
    // }
    return '';
  };

  useEffect(() => {
    // console.log('useEffect in QuestionnaireAnswers (question-list-retrieve)');
    // if (allQuestionsCache) {
    //   setQuestionList(Object.values(allQuestionsCache));
    // }
  }, [allQuestionsCache]);

  return (
    <div>
      <Helmet>
        <title>
          Questionnaire Answers -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <meta name="robots" content="noindex" data-react-helmet="true" />
      </Helmet>
      <PageContentContainer>
        {questionnaire.questionnaireName && (
          <TitleWrapper>
            {questionnaire.questionnaireName}
          </TitleWrapper>
        )}
        <AnsweredBy>
          Answered by:
          {' '}
          <AnsweredBySpan>{useGetFullNamePreferred(personId)}</AnsweredBySpan>
          {/* <AnsweredBySpan>{person ? getFullNamePreferredPerson(person) : 'tbd'}</AnsweredBySpan> */}
        </AnsweredBy>
        <FormControl classes={{ root: classes.formControl }}>
          {questionList && questionList.map((question) => (
            <OneQuestionWrapper key={`questionnaire-${question.id}`}>
              <QuestionText>
                {question.questionText}
                {question.requireAnswer && <RequiredStar> *</RequiredStar>}
              </QuestionText>
              {question.questionInstructions && (
                <QuestionInstructions>
                  {question.questionInstructions}
                </QuestionInstructions>
              )}
              <QuestionFormWrapper>
                <TextField
                  classes={(question.answerType === 'INTEGER') ? {} : { root: classes.formControl }}
                  id={`questionAnswerToBeSaved-${question.id}`}
                  name={`questionAnswer-${question.id}`}
                  margin="dense"
                  variant="outlined"
                  placeholder={question.questionPlaceholder || ''}
                  value={getAnswerValue(question.id)}
                />
              </QuestionFormWrapper>
            </OneQuestionWrapper>
          ))}
        </FormControl>
      </PageContentContainer>
    </div>
  );
};
QuestionnaireAnswers.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  formControl: {
    width: '100%',
  },
  saveAnswersButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AnsweredBy = styled('div')`
  font-size: 1.3em;
  font-weight: 300;
  height: 100px;
  align-content: center;
`;

const AnsweredBySpan = styled('span')`
  font-weight: bold;
`;

const OneQuestionWrapper = styled('div')`
  border-top: 1px solid ${DesignTokenColors.neutralUI200};
  margin-top: 24px;
`;

const QuestionInstructions = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
`;

const QuestionFormWrapper = styled('div')`
  width: 100%;
`;

const QuestionText = styled('div')`
`;

const RequiredStar = styled('span')`
  color: ${DesignTokenColors.alert800};
  font-weight: bold;
`;

const TitleWrapper = styled('h1')`
  margin-bottom: 8px;
`;

export default withStyles(styles)(QuestionnaireAnswers);
