import isEqual from 'lodash-es/isEqual';

export function getInitialGlobalQuestionnaireVariables () {
  return {
    allQuestionnairesCache: {}, // This is a dictionary key: questionnaireId, value: questionnaire dict
    allQuestionsCache: {}, // This is a dictionary key: questionId, value: question dict
    allAnswersCache: {}, // This is a dictionary key: personId, value: another dictionary key: questionId, value: answer dict
    dateQuestionnaireCompletedDict: {}, // This is a dictionary key: personId, value: another dictionary key: questionnaireId, value: dateQuestionnaireCompleted
    mostRecentQuestionIdSaved: -1,
    mostRecentQuestionSaved: {
      questionnaireId: -1,
    },
    mostRecentQuestionnaireIdSaved: -1,
    mostRecentQuestionnaireSaved: {
      firstName: '',
      lastName: '',
      questionnaireId: -1,
    },
    questionsAnsweredPersonIdList: {}, // This is a dictionary key: questionId, value: list of personIds who have answered the question
    questionnairesAnsweredByPersonList: {}, // This is a dictionary key: questionnaireId, value: list of personIds who have answered the questionnaire
    questionnairesAnsweredListByPersonId: {}, // This is a dictionary key: personId, value: list of questionnaireIds the person has answered
    searchResults: [],
  };
}

// This is called after making this fetchData request:
// const questionnaireResponsesListRetrieveResults = useFetchData(['questionnaire-list-retrieve'], {});
export function captureQuestionnaireListRetrieveData (
  incomingRetrieveResults = {},
  apiDataCache = {},
  dispatch,
) {
  const { data, isSuccess } = incomingRetrieveResults;
  const allQuestionnairesCache = apiDataCache.allQuestionnairesCache || {};
  const changeResults = {
    allQuestionnairesCache,
    allQuestionnairesCacheChanged: false,
  };
  const allQuestionnairesCacheNew = { ...allQuestionnairesCache };
  let newQuestionnaireListDataReceived = false;
  if (data && data.questionnaireList && isSuccess === true) {
    data.questionnaireList.forEach((questionnaire) => {
      if (questionnaire && questionnaire.questionnaireId && questionnaire.questionnaireId >= 0) {
        if (!allQuestionnairesCacheNew[questionnaire.questionnaireId]) {
          allQuestionnairesCacheNew[questionnaire.questionnaireId] = questionnaire;
          newQuestionnaireListDataReceived = true;
        } else if (!isEqual(questionnaire, allQuestionnairesCacheNew[questionnaire.questionnaireId])) {
          allQuestionnairesCacheNew[questionnaire.questionnaireId] = questionnaire;
          newQuestionnaireListDataReceived = true;
        }
      }
    });
  }
  if (newQuestionnaireListDataReceived) {
    // console.log('QuestionnaireListRetrieve setting allQuestionnairesCacheNew:', allQuestionnairesCacheNew);
    dispatch({ type: 'updateByKeyValue', key: 'allQuestionnairesCache', value: allQuestionnairesCacheNew });
    changeResults.allQuestionnairesCache = allQuestionnairesCacheNew;
    changeResults.allQuestionnairesCacheChanged = true;
  }
  return changeResults;
}

// This is called after making this fetchData request:
// const questionnaireResponsesListRetrieveResults = useFetchData(['questionnaire-responses-list-retrieve'], {});
export function captureQuestionnaireResponsesListRetrieveData (
  incomingRetrieveResults = {},
  apiDataCache = {},
  dispatch,
) {
  const { data, isSuccess } = incomingRetrieveResults;
  // allTaskDefinitionsCache -> allQuestionnairesCache
  const allQuestionnairesCache = apiDataCache.allQuestionnairesCache || {};
  // allTaskGroupsCache -> allQuestionsCache
  const allQuestionsCache = apiDataCache.allQuestionsCache || {};
  // allTasksCache -> allAnswersCache
  const allAnswersCache = apiDataCache.allAnswersCache || {};
  const changeResults = {
    allQuestionnairesCache,
    allQuestionnairesCacheChanged: false,
    allQuestionsCache,
    allQuestionsCacheChanged: false,
    allAnswersCache,
    allAnswersCacheChanged: false,
  };
  const allQuestionnairesCacheNew = { ...allQuestionnairesCache };
  const allQuestionsCacheNew = { ...allQuestionsCache };
  const allAnswersCacheNew = { ...allAnswersCache };
  let newQuestionnaireListDataReceived = false;
  if (data && data.questionnaireList && isSuccess === true) {
    data.questionnaireList.forEach((questionnaire) => {
      if (questionnaire && questionnaire.questionnaireId && questionnaire.questionnaireId >= 0) {
        if (!allQuestionnairesCacheNew[questionnaire.questionnaireId]) {
          allQuestionnairesCacheNew[questionnaire.questionnaireId] = questionnaire;
          newQuestionnaireListDataReceived = true;
        } else if (!isEqual(questionnaire, allQuestionnairesCacheNew[questionnaire.questionnaireId])) {
          allQuestionnairesCacheNew[questionnaire.questionnaireId] = questionnaire;
          newQuestionnaireListDataReceived = true;
        }
      }
    });
  }
  let newQuestionListDataReceived = false;
  if (data && data.questionList && isSuccess === true) {
    data.questionList.forEach((question) => {
      if (question && question.questionId && question.questionId >= 0) {
        if (!allQuestionsCacheNew[question.questionId]) {
          allQuestionsCacheNew[question.questionId] = question;
          newQuestionListDataReceived = true;
        } else if (!isEqual(question, allQuestionsCacheNew[question.questionId])) {
          allQuestionsCacheNew[question.questionId] = question;
          newQuestionListDataReceived = true;
        }
      }
    });
  }
  let newAnswerListDataReceived = false;
  if (data && data.taskList && isSuccess === true) {
    data.taskList.forEach((task) => {
      if (task && task.personId && task.personId >= 0 && task.questionnaireId && task.questionnaireId >= 0) {
        if (!allAnswersCacheNew[task.personId]) {
          allAnswersCacheNew[task.personId] = {};
        }
        if (!allAnswersCacheNew[task.personId][task.questionnaireId]) {
          allAnswersCacheNew[task.personId][task.questionnaireId] = task;
          newAnswerListDataReceived = true;
        } else if (!isEqual(task, allAnswersCacheNew[task.personId][task.questionnaireId])) {
          allAnswersCacheNew[task.personId][task.questionnaireId] = task;
          newAnswerListDataReceived = true;
        }
      }
    });
    if (newQuestionnaireListDataReceived) {
      // console.log('QuestionnaireListRetrieve setting allQuestionnairesCacheNew:', allQuestionnairesCacheNew);
      dispatch({ type: 'updateByKeyValue', key: 'allQuestionnairesCache', value: allQuestionnairesCacheNew });
      changeResults.allQuestionnairesCache = allQuestionnairesCacheNew;
      changeResults.allQuestionnairesCacheChanged = true;
    }
    if (newQuestionListDataReceived) {
      // console.log('QuestionnaireListRetrieve setting allQuestionsCacheNew:', allQuestionsCacheNew);
      dispatch({ type: 'updateByKeyValue', key: 'allQuestionsCache', value: allQuestionsCacheNew });
      changeResults.allQuestionsCache = allQuestionsCacheNew;
      changeResults.allQuestionsCacheChanged = true;
    }
    if (newAnswerListDataReceived) {
      // console.log('QuestionnaireListRetrieve setting allAnswersCacheNew:', allAnswersCacheNew);
      dispatch({ type: 'updateByKeyValue', key: 'allAnswersCache', value: allAnswersCacheNew });
      changeResults.allAnswersCache = allAnswersCacheNew;
      changeResults.allAnswersCacheChanged = true;
    }
  }
  return changeResults;
}

// This is called after making this fetchData request:
// const questionListRetrieveResults = useFetchData(['question-list-retrieve'], {}, METHOD.GET);
export function captureQuestionListRetrieveData (
  incomingRetrieveResults = {},
  apiDataCache = {},
  dispatch,
) {
  const { data, isSuccess } = incomingRetrieveResults;
  const allQuestionsCache = apiDataCache.allQuestionsCache || {};
  const changeResults = {
    allQuestionsCache,
    allQuestionsCacheChanged: false,
  };
  const allQuestionsCacheNew = { ...allQuestionsCache };
  let newQuestionListDataReceived = false;
  if (data && data.questionList && isSuccess === true) {
    data.questionList.forEach((question) => {
      if (question && question.questionId && question.questionId >= 0) {
        if (!allQuestionsCacheNew[question.questionId]) {
          allQuestionsCacheNew[question.questionId] = question;
          newQuestionListDataReceived = true;
        } else if (!isEqual(question, allQuestionsCacheNew[question.questionId])) {
          allQuestionsCacheNew[question.questionId] = question;
          newQuestionListDataReceived = true;
        }
      }
    });
  }
  if (newQuestionListDataReceived) {
    // console.log('QuestionnaireListRetrieve setting allQuestionsCacheNew:', allQuestionsCacheNew);
    dispatch({ type: 'updateByKeyValue', key: 'allQuestionsCache', value: allQuestionsCacheNew });
    changeResults.allQuestionsCache = allQuestionsCacheNew;
    changeResults.allQuestionsCacheChanged = true;
  }
  return changeResults;
}
