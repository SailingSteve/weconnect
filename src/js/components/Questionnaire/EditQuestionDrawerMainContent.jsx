import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import EditQuestionForm from './EditQuestionForm';


const EditQuestionDrawerMainContent = () => {
  renderLog('EditQuestionDrawerMainContent');

  return (
    <EditQuestionDrawerMainContentWrapper>
      <EditQuestionWrapper>
        <EditQuestionForm />
      </EditQuestionWrapper>
    </EditQuestionDrawerMainContentWrapper>
  );
};

const EditQuestionDrawerMainContentWrapper = styled('div')`
`;

const EditQuestionWrapper = styled('div')`
  margin-top: 32px;
`;

export default EditQuestionDrawerMainContent;
