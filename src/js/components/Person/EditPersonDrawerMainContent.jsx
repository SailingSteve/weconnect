import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import EditPersonForm from './EditPersonForm';


const EditPersonDrawerMainContent = () => {
  renderLog('EditPersonDrawerMainContent');

  return (
    <EditPersonDrawerMainContentWrapper>
      <EditPersonWrapper>
        <EditPersonForm />
      </EditPersonWrapper>
    </EditPersonDrawerMainContentWrapper>
  );
};

const EditPersonDrawerMainContentWrapper = styled('div')`
`;

const EditPersonWrapper = styled('div')`
  margin-top: 32px;
`;

export default EditPersonDrawerMainContent;
