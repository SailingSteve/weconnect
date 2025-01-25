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
import { useQuestionnaireAnswersSaveMutation } from '../react-query/mutations';
import { useFetchData } from '../react-query/WeConnectQuery';


// eslint-disable-next-line no-unused-vars
const AnswerQuestionsForm = ({ classes, match }) => {
  renderLog('AnswerQuestionsForm');  // Set LOG_RENDER_EVENTS to log all renders
  const { mutate } = useQuestionnaireAnswersSaveMutation();
  const params  = useParams();

  const [questionnaireId] = useState(params.questionnaireId);
  const [personId] = useState(params.personId);
  const [questionList, setQuestionList] = useState(undefined);
  const [questionnaireList, setQuestionnaireList] = useState(undefined);
  const [questionnaire, setQuestionnaire] = useState(undefined);
  const [questionAnswerList, setQuestionAnswerList] = useState(undefined);
  const [saveButtonActive, setSaveButtonActive] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [errorMessage, setErrorMessage] = useState(undefined);

  const requestParams = `personIdList[]=${personId}&questionnaireId=${questionnaireId}`;
  const { data: dataQRL, isSuccess: isSuccessQRL, isFetching: isFetchingQRL } = useFetchData(['questionnaire-responses-list-retrieve'], requestParams);
  if (isFetchingQRL) {
    console.log('isFetching  ------------ \'questionnaire-responses-list-retrieve\'');
  }

  useEffect(() => {
    if (dataQRL !== undefined && isFetchingQRL === false && personId) {
      // console.log('useFetchData in AnswerQuestionsForm useEffect dataQRL is good:', dataQRL, isSuccessQRL, isFetchingQRL);
      // console.log('Successfully retrieved QuestionnaireResponsesList...');
      setQuestionnaireList(dataQRL.questionnaireList);
      if (questionnaireList && questionnaireList.length) {
        setQuestionnaire(questionnaireList[questionnaireId]);
      }
      setQuestionAnswerList(dataQRL.questionAnswerList);
      setQuestionList(dataQRL.questionList);
    }
  }, [dataQRL, isFetchingQRL, isSuccessQRL, personId]);

  const updateQuestionAnswer = (questionId) => {
    // eslint-disable-next-line no-restricted-globals
    const newValue = event.target.value;
    setInputValues({ ...inputValues, [questionId]: newValue });
    setSaveButtonActive(true);
  };

  const saveAnswers = () => {
    let foundError = false;
    Object.keys(inputValues).forEach((key) => {
      const cleanKey = parseInt(key.match(/\d+/g));
      const question = questionList.find((q) => q.questionId === cleanKey);
      if (question.answerType === 'BOOLEAN') {
        const boolAnswers = ['t', 'f', 'true', 'false', '1', '0'];
        if (boolAnswers.includes(inputValues[key])) {
          setErrorMessage(`"${question.questionText}" requires a boolean answer ('true' or 't' or 'false' or 'f')`);
          setSaveButtonActive(false);
          foundError = true;
        }
      } else if (question.answerType === 'INTEGER') {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(inputValues[key])) {
          setErrorMessage(`"${question.questionText}" requires a numeric answer`);
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

    mutate(requestParams2);
    // console.log('saveAnswers data:', data);
    setSaveButtonActive(false);
  };

  const getInitialAnswer = (questionId) => {
    if (!questionAnswerList || questionAnswerList.length === 0) {
      console.log(questionId, 'n/a');
      return '';
    }
    const answer = questionAnswerList.filter((answerIteration) => answerIteration.questionId === questionId);
    let initVal = '';
    if (answer.length) {
      switch (answer[0].answerType) {
        case 'BOOLEAN':
          initVal = answer.length ? answer[0].answerBoolean : '';
          break;
        case 'INTEGER':
          initVal = answer.length ? answer[0].answerInteger : '';
          break;
        default:
        case 'STRING':
          initVal = answer.length ? answer[0].answerString : '';
          break;
      }
    }
    return initVal;
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
        <TitleWrapper>
          {questionnaire && questionnaire.questionnaireTitle}
        </TitleWrapper>
        <InstructionsWrapper>
          {questionnaire && questionnaire.questionnaireInstructions}
        </InstructionsWrapper>
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
                  defaultValue={getInitialAnswer(question.id)}
                  id={`questionAnswerToBeSaved-${question.id}`}
                  label={`${question.answerType}`}
                  margin="dense"
                  name={`questionAnswer-${question.id}`}
                  onChange={() => updateQuestionAnswer(`questionAnswer-${question.id}`)}
                  variant="outlined"
                />
              </QuestionFormWrapper>
            </OneQuestionWrapper>
          ))}
          <ErrorLine>{errorMessage}</ErrorLine>
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
AnswerQuestionsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
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

const InstructionsWrapper = styled('div')`
  color: ${DesignTokenColors.neutralUI300};
  font-size: 1.2em;
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

const SaveButtonWrapper = styled('div')`
  margin-top: 24px;
`;

const ErrorLine = styled('div')`
  margin-top: 24px;
  font-weight: 500;
  color: red;
`;

const TitleWrapper = styled('h1')`
  margin-bottom: 8px;
`;

export default withStyles(styles)(AnswerQuestionsForm);
