import React, { useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import QuestionnaireResponsesList from '../Questionnaire/QuestionnaireResponsesList';
import PersonProfile from './PersonProfile';


const PersonProfileDrawerMainContent = () => {
  renderLog('PersonProfileDrawerMainContent');
  const { getAppContextValue } = useConnectAppContext();
  const [personId] = useState(getAppContextValue('personDrawersPersonId'));

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile personId={personId} />
      <QuestionnaireResponsesList personId={personId} />
    </PersonProfileDrawerMainContentWrapper>
  );
};

const PersonProfileDrawerMainContentWrapper = styled('div')`
`;

export default PersonProfileDrawerMainContent;
