import React, { useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditPersonAwayForm from './EditPersonAwayForm';
import QuestionnaireResponsesList from '../Questionnaire/QuestionnaireResponsesList';
import PersonProfile from './PersonProfile';
import { SpanWithLinkStyle } from '../Style/linkStyles';


const PersonProfileDrawerMainContent = () => {
  renderLog('PersonProfileDrawerMainContent');
  const { getAppContextValue } = useConnectAppContext();

  const [personId] = useState(getAppContextValue('personDrawersPersonId'));
  const [showPersonAway, setShowPersonAway] = useState(false);

  return (
    <PersonProfileDrawerMainContentWrapper>
      <PersonProfile personId={personId} />
      <QuestionnaireResponsesList personId={personId} />
      <PersonAwayTitleAndToggle>
        <PersonAwayTitle>
          My availability
        </PersonAwayTitle>
        {' '}
        (
        {showPersonAway ? (
          <SpanWithLinkStyle onClick={() => setShowPersonAway(false)}>hide</SpanWithLinkStyle>
        ) : (
          <SpanWithLinkStyle onClick={() => setShowPersonAway(true)}>show</SpanWithLinkStyle>
        )}
        )
      </PersonAwayTitleAndToggle>
      {showPersonAway && (
        <EditPersonAwayForm personId={personId} />
      )}
    </PersonProfileDrawerMainContentWrapper>
  );
};

const PersonProfileDrawerMainContentWrapper = styled('div')`
`;

const PersonAwayTitle = styled('span')`
  font-weight: bold;
`;

const PersonAwayTitleAndToggle = styled('div')`
  margin-top: 12px;
`;

export default PersonProfileDrawerMainContent;
