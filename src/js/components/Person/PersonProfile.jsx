import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
// import useGetFullNamePreferredReactQuery from '../../react-query/useGetFullNamePreferredReactQuery';
import CopyQuestionnaireLink from '../Questionnaire/CopyQuestionnaireLink';
import { useGetFullNamePreferred, useGetPersonById } from '../../models/PersonModel';


const PersonProfile = () => {
  renderLog('PersonProfile');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();

  // const [person] = useState(getAppContextValue('personDrawersPerson'));
  const [person] = useState(useGetPersonById(getAppContextValue('personDrawersPersonId')));

  useEffect(() => {
    // Hard coded temporarily while we are in development
    setAppContextValue('QuestionnaireId', 1);
  }, []);

  return (
    <PersonProfileWrapper>
      <FullName>
        {useGetFullNamePreferred(person.personId)}
      </FullName>
      {/* <PersonDetails /> This was commented out as of January 28th, 2025 */}
      <CopyQuestionnaireLink />
    </PersonProfileWrapper>
  );
};

const FullName = styled('div')`
`;

const PersonProfileWrapper = styled('div')`
`;

export default PersonProfile;
