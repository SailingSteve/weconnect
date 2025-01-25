import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import EditTaskDefinitionForm from './EditTaskDefinitionForm';


const EditTaskDefinitionDrawerMainContent = () => {
  renderLog('EditTaskDefinitionDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <EditTaskDefinitionDrawerMainContentWrapper>
      <AddTaskDefinitionWrapper>
        <EditTaskDefinitionForm />
      </AddTaskDefinitionWrapper>
    </EditTaskDefinitionDrawerMainContentWrapper>
  );
};

const EditTaskDefinitionDrawerMainContentWrapper = styled('div')`
`;

const AddTaskDefinitionWrapper = styled('div')`
  margin-top: 32px;
`;

export default EditTaskDefinitionDrawerMainContent;
