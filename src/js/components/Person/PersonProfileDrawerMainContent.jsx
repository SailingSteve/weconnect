import React from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import QuestionnaireResponsesList from '../Questionnaire/QuestionnaireResponsesList';
import PersonProfile from './PersonProfile';


const PersonProfileDrawerMainContent = () => {
  renderLog('PersonProfileDrawerMainContent');

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile />
      {/* <QuestionnaireResponsesList /> */}
    </PersonProfileDrawerMainContentWrapper>
  );
};

const PersonProfileDrawerMainContentWrapper = styled('div')`
`;

export default PersonProfileDrawerMainContent;
