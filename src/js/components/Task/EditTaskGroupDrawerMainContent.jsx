import React from 'react';
import styled from 'styled-components';
import { withStyles } from '@mui/styles';
import { renderLog } from '../../common/utils/logging';
import EditTaskGroupForm from './EditTaskGroupForm';


const EditTaskGroupDrawerMainContent = () => {
  renderLog('EditTaskGroupDrawerMainContent');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <EditTaskGroupDrawerMainContentWrapper>
      <AddTaskGroupWrapper>
        <EditTaskGroupForm />
      </AddTaskGroupWrapper>
    </EditTaskGroupDrawerMainContentWrapper>
  );
};

const styles = () => ({
});

const EditTaskGroupDrawerMainContentWrapper = styled('div')`
`;

const AddTaskGroupWrapper = styled('div')`
  margin-top: 32px;
`;

export default withStyles(styles)(EditTaskGroupDrawerMainContent);
