import { Button, FormControl, TextField } from '@mui/material';
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
import makeRequestParams from '../react-query/makeRequestParams';
import { useAnswerListSaveMutation } from '../react-query/mutations';
import { METHOD, useFetchData } from '../react-query/WeConnectQuery';
import capturePersonListRetrieveData from '../models/capturePersonListRetrieveData';
import { useConnectAppContext, useConnectDispatch } from '../contexts/ConnectAppContext';
import {
  captureAnswerListRetrieveData,
  captureQuestionListRetrieveData,
  captureQuestionnaireListRetrieveData,
  getAnswerToQuestion, getAnswerValueToQuestion,
  getQuestionById,
  getQuestionsForQuestionnaire,
} from '../models/QuestionnaireModel';
import convertToInteger from '../common/utils/convertToInteger';


const AnswerQuestions = ({ classes }) => {
  renderLog('AnswerQuestions');  // Set LOG_RENDER_EVENTS to log all renders
  const { apiDataCache } = useConnectAppContext();
  const { allAnswersCache, allPeopleCache, allQuestionnairesCache, allQuestionsCache } = apiDataCache;
  const dispatch = useConnectDispatch();
  const { mutate: answerListSave } = useAnswerListSaveMutation();
  const params  = useParams();

  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [inputValues, setInputValues] = useState({});
  const [inputValuesInError, setInputValuesInError] = useState({});
  const [personId] = useState(parseInt(params.personId, 10));
  const [questionList, setQuestionList] = useState(undefined);
  const [questionnaire, setQuestionnaire] = useState(undefined);
  const [questionnaireId] = useState(parseInt(params.questionnaireId, 10));
  const [saveButtonActive, setSaveButtonActive] = useState(false);

  // In time, convert to only retrieve one person
  const personListRetrieveResults = useFetchData(['person-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    if (personListRetrieveResults) {
      capturePersonListRetrieveData(personListRetrieveResults, apiDataCache, dispatch);
    }
  }, [personListRetrieveResults, allPeopleCache, dispatch]);

  const questionnaireListRetrieveResults = useFetchData(['questionnaire-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    if (questionnaireListRetrieveResults) {
      captureQuestionnaireListRetrieveData(questionnaireListRetrieveResults, apiDataCache, dispatch);
    }
  }, [questionnaireListRetrieveResults, allQuestionnairesCache]);

  const questionListRetrieveResults = useFetchData(['question-list-retrieve'], { questionnaireId: questionnaireId || '-1' }, METHOD.GET);
  useEffect(() => {
    if (questionListRetrieveResults) {
      captureQuestionListRetrieveData(questionListRetrieveResults, apiDataCache, dispatch);
    }
  }, [questionListRetrieveResults, allQuestionsCache]);

  const requestParams = `personIdList[]=${personId}&questionnaireId=${questionnaireId}`;
  const answerListRetrieveResults = useFetchData(['questionnaire-responses-list-retrieve'], requestParams, METHOD.GET);
  useEffect(() => {
    if (answerListRetrieveResults) {
      captureAnswerListRetrieveData(answerListRetrieveResults, apiDataCache, dispatch);
    }
  }, [allAnswersCache, answerListRetrieveResults]); // allAnswersCache

  useEffect(() => {
    if (allQuestionnairesCache) {
      if (questionnaireId && allQuestionnairesCache[questionnaireId]) {
        setQuestionnaire(allQuestionnairesCache[questionnaireId]);
      }
    }
  }, [allQuestionnairesCache]);

  useEffect(() => {
    // console.log('Questionnaire useEffect getQuestionsForQuestionnaire(questionnaireId):', questionnaireId);
    const questionsForCurrentQuestionnaire = getQuestionsForQuestionnaire(questionnaireId, allQuestionsCache) || [];
    if (questionsForCurrentQuestionnaire && questionsForCurrentQuestionnaire.length > 0) {
      setQuestionList(questionsForCurrentQuestionnaire);
    }
  }, [allQuestionsCache, questionnaireId]);

  const allRequiredFieldsHaveValue = (inputValuesRevised) => {
    let requiredValueMissing = false;
    questionList.forEach((question) => {
      if (question.requireAnswer === true) {
        let answerValue;
        if (`questionAnswer-${question.id}` in inputValuesRevised) {
          answerValue = inputValuesRevised[`questionAnswer-${question.id}`];
        } else {
          answerValue = getAnswerValueToQuestion(personId, question.id, allAnswersCache);
        }
        if (answerValue === undefined || answerValue === null || answerValue === '') {
          requiredValueMissing = true;
        }
      }
    });
    return !requiredValueMissing;
  };

  const updateQuestionAnswer = (questionId) => {
    // eslint-disable-next-line no-restricted-globals
    const newValue = event.target.value;
    const question = getQuestionById(questionId, allQuestionsCache);
    // console.log('question:', question);
    let inError = false;
    let inputValuesRevised = { ...inputValues };
    if (question && question.answerType) {
      if (question.answerType === 'BOOLEAN') {
        // console.log('Converting to boolean newValue:', newValue);
        setInputValues({ ...inputValues, [`questionAnswer-${questionId}`]: !!newValue });
      } else if (question.answerType === 'INTEGER') {
        const newValueAsInteger = convertToInteger(newValue);
        // console.log('Converting to integer newValue:', newValue, ', newValueAsInteger:', newValueAsInteger);
        inError = newValue !== newValueAsInteger.toString(); // Compare as strings
        setInputValuesInError({ ...inputValuesInError, [questionId]: inError });
        // Store only the integer version
        inputValuesRevised = { ...inputValuesRevised, [`questionAnswer-${questionId}`]: newValueAsInteger };
        setInputValues(inputValuesRevised);
      } else {
        inputValuesRevised = { ...inputValuesRevised, [`questionAnswer-${questionId}`]: newValue };
        setInputValues(inputValuesRevised);
      }
    } else {
      inputValuesRevised = { ...inputValuesRevised, [`questionAnswer-${questionId}`]: newValue };
      setInputValues(inputValuesRevised);
    }
    const requiredValuesExist = allRequiredFieldsHaveValue(inputValuesRevised);
    // console.log('updateQuestionAnswer inError: ', inError, ', requiredValuesExist:', requiredValuesExist);
    setSaveButtonActive(!inError && requiredValuesExist);
  };

  const saveAnswers = () => {
    let foundError = false;
    Object.keys(inputValues).forEach((key) => {
      const questionId = parseInt(key.match(/\d+/g));
      // console.log('Save key:', key, 'value:', inputValues[key], 'questionId:', questionId);
      const question = getQuestionById(questionId, allQuestionsCache);
      if (question.answerType === 'BOOLEAN') {
        const boolAnswers = ['t', 'f', 'true', 'false', '1', '0'];
        if (boolAnswers.includes(inputValues[questionId])) {
          setErrorMessage(`"${question.questionText}" requires 'true' or 'false'.`);
          setSaveButtonActive(false);
          foundError = true;
        }
      } else if (question.answerType === 'INTEGER') {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(inputValues[questionId])) {
          setErrorMessage(`"${question.questionText}" requires a single number.`);
          setSaveButtonActive(false);
          foundError = true;
        }
      }
    });
    if (!foundError) {
      setErrorMessage(undefined);
    }

    const requestParams2 = makeRequestParams({
      questionnaireId,
      personId,
      ...inputValues,
    }, {});

    answerListSave(requestParams2);
    // console.log('saveAnswers requestParams2:', requestParams2);
    setSaveButtonActive(false);
    setAnswersSubmitted(true);
  };

  const isQuestionIdInError = (questionId) => inputValuesInError[questionId] === true;

  const helperTextIfQuestionIdInError = (questionId) => {
    const answer = getAnswerToQuestion(personId, questionId, allAnswersCache);
    if (!answer || !answer.answerType) {
      return '';
    }
    // console.log(`helperTextIfQuestionIdInError for questionId: ${questionId}, answer:`, answer);
    let helperText = '';
    switch (answer.answerType) {
      case 'BOOLEAN':
        helperText = 'Please enter "true" or "false",';
        break;
      case 'INTEGER':
        helperText = 'Please enter one number.';
        break;
      default:
      case 'STRING':
        helperText = '';
        break;
    }
    // console.log('helperTextIfQuestionIdInError helperText:', helperText);
    return helperText;
  };

  return (
    <div>
      <Helmet>
        <title>
          Questionnaire For You -
          {' '}
          {webAppConfig.NAME_FOR_BROWSER_TAB_TITLE}
        </title>
        <meta name="robots" content="noindex" data-react-helmet="true" />
      </Helmet>
      <PageContentContainer>
        {answersSubmitted && (
          <SuccessMessage>
            Your answers have been submitted successfully. Thank you for your participation.
          </SuccessMessage>
        )}
        <QuestionsHeaderWrapper>
          {(questionnaire && questionnaire.questionnaireTitle) && (
            <TitleWrapper>
              {questionnaire.questionnaireTitle}
            </TitleWrapper>
          )}
          {(questionnaire && questionnaire.questionnaireInstructions) && (
            <InstructionsWrapper>
              {questionnaire.questionnaireInstructions}
            </InstructionsWrapper>
          )}
        </QuestionsHeaderWrapper>
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
              {answersSubmitted ? (
                <AnswerText>
                  YOU ANSWERED:
                  {' '}
                  {getAnswerValueToQuestion(personId, question.id, allAnswersCache)}
                </AnswerText>
              ) : (
                <QuestionFormWrapper>
                  <TextField
                    classes={(question.answerType === 'INTEGER') ? {} : { root: classes.formControl }}
                    defaultValue={getAnswerValueToQuestion(personId, question.id, allAnswersCache)}
                    error={isQuestionIdInError(question.id)}
                    helperText={isQuestionIdInError(question.id) ? helperTextIfQuestionIdInError(question.id) : ''}
                    id={`questionAnswer-${question.id}`}
                    InputProps={{
                      style: { height: 'auto' },
                    }}
                    margin="dense"
                    minRows={1}
                    maxRows={4}
                    multiline
                    name={`questionAnswer-${question.id}`}
                    onChange={() => updateQuestionAnswer(question.id)}
                    placeholder={question.questionPlaceholder || ''}
                    variant="outlined"
                  />
                </QuestionFormWrapper>
              )}
            </OneQuestionWrapper>
          ))}
          {!answersSubmitted && (
            <ErrorLine>{errorMessage}</ErrorLine>
          )}
          <SaveButtonWrapper>
            <Button
              classes={{ root: classes.saveAnswersButton }}
              color="primary"
              disabled={!saveButtonActive}
              variant="contained"
              onClick={saveAnswers}
            >
              Save Your Answers
            </Button>
          </SaveButtonWrapper>
        </FormControl>
      </PageContentContainer>
    </div>
  );
};
AnswerQuestions.propTypes = {
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

const AnswerText = styled('div')`
  font-weight: 500;
  color: green;
`;

const ErrorLine = styled('div')`
  margin-top: 24px;
  font-weight: 500;
  color: red;
`;

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
`;

const OneQuestionWrapper = styled('div')`
  // border-bottom: 1px solid ${DesignTokenColors.neutralUI200};
  margin-bottom: 24px;
`;

const QuestionInstructions = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
`;

const QuestionFormWrapper = styled('div')`
  width: 100%;
`;

const QuestionText = styled('div')`
`;

const QuestionsHeaderWrapper = styled('div')`
  margin-bottom: 24px;
`;

const RequiredStar = styled('span')`
  color: ${DesignTokenColors.alert800};
  font-weight: bold;
`;

const SaveButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const SuccessMessage = styled('div')`
  margin-top: 24px;
  font-weight: 500;
  color: green;
`;

const TitleWrapper = styled('h1')`
  margin-bottom: 8px;
`;

export default withStyles(styles)(AnswerQuestions);
