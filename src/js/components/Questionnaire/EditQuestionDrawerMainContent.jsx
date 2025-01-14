import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import AppObservableStore from '../../stores/AppObservableStore';
import QuestionnaireActions from '../../actions/QuestionnaireActions';
import apiCalming from '../../common/utils/apiCalming';
import { renderLog } from '../../common/utils/logging';
import EditQuestionForm from './EditQuestionForm';


const EditQuestionDrawerMainContent = () => {
  renderLog('EditQuestionDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders

  React.useEffect(() => {
    // We currently don't retrieve individual questions, only complete question lists for a questionnaire.
    const questionnaireIdTemp = AppObservableStore.getGlobalVariableState('editQuestionDrawerQuestionnaireId');
    if (apiCalming(`questionListRetrieve-${questionnaireIdTemp}`, 30000)) {
      QuestionnaireActions.questionListRetrieve(questionnaireIdTemp);
    }
  }, []);

  return (
    <EditQuestionDrawerMainContentWrapper>
      <EditQuestionWrapper>
        <EditQuestionForm />
      </EditQuestionWrapper>
    </EditQuestionDrawerMainContentWrapper>
  );
};

const styles = () => ({
});

const EditQuestionDrawerMainContentWrapper = styled('div')`
`;

const EditQuestionWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(styles)(EditQuestionDrawerMainContent);
