import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext, useConnectDispatch } from '../../contexts/ConnectAppContext';
import CopyQuestionnaireLink from '../Questionnaire/CopyQuestionnaireLink';
import { useGetFullNamePreferred } from '../../models/PersonModel';
import { SpanWithLinkStyle } from '../Style/linkStyles';
import { METHOD, useFetchData } from '../../react-query/WeConnectQuery';
import { captureQuestionnaireListRetrieveData } from '../../models/QuestionnaireModel';


const PersonProfile = () => {
  renderLog('PersonProfile');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();
  const { apiDataCache } = useConnectAppContext();
  const { allQuestionnairesCache } = apiDataCache;
  const dispatch = useConnectDispatch();

  const [personId] = useState(getAppContextValue('personDrawersPersonId'));
  const [questionnaireList, setQuestionnaireList] = useState([]);
  const [showQuestionnaireList, setShowQuestionnaireList] = useState(false);

  const questionnaireListRetrieveResults = useFetchData(['questionnaire-list-retrieve'], {}, METHOD.GET);
  useEffect(() => {
    // console.log('questionnaireListRetrieveResults in Questionnaire useEffect captureQuestionnaireListRetrieveData');
    if (questionnaireListRetrieveResults) {
      captureQuestionnaireListRetrieveData(questionnaireListRetrieveResults, apiDataCache, dispatch);
    }
  }, [questionnaireListRetrieveResults, allQuestionnairesCache]);

  useEffect(() => {
    if (allQuestionnairesCache) {
      setQuestionnaireList(Object.values(allQuestionnairesCache));
    }
  }, [allQuestionnairesCache]);

  return (
    <PersonProfileWrapper>
      <FullName>
        {useGetFullNamePreferred(personId)}
      </FullName>
      {/* <PersonDetails /> This was commented out as of January 28th, 2025 */}
      <ShowQuestionnaireOptions>
        <div>
          Questionnaires
          {' '}
          (
          {showQuestionnaireList ? (
            <SpanWithLinkStyle onClick={() => setShowQuestionnaireList(false)}>hide</SpanWithLinkStyle>
          ) : (
            <SpanWithLinkStyle onClick={() => setShowQuestionnaireList(true)}>show</SpanWithLinkStyle>
          )}
          )
        </div>
      </ShowQuestionnaireOptions>
      {showQuestionnaireList && (
        <QuestionnaireOptions>
          {questionnaireList.map((questionnaire) => (
            <OneQuestionnaire key={`questionnaire-${questionnaire.questionnaireId}`}>
              <div>{questionnaire.questionnaireName}</div>
              <CopyQuestionnaireLink personId={personId} questionnaireId={questionnaire.questionnaireId} />
            </OneQuestionnaire>
          ))}
        </QuestionnaireOptions>
      )}
    </PersonProfileWrapper>
  );
};

const FullName = styled('h2')`
`;

const OneQuestionnaire = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const PersonProfileWrapper = styled('div')`
`;

const QuestionnaireOptions = styled('div')`
`;

const ShowQuestionnaireOptions = styled('div')`
`;

export default PersonProfile;
