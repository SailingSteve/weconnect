import React, { useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditQuestionDrawerMainContent from '../Questionnaire/EditQuestionDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';

const EditQuestionDrawer = () => {
  renderLog('EditQuestionDrawer');
  const { getAppContextValue } = useConnectAppContext();

  const question = getAppContextValue('selectedQuestion');
  const markup = question && question.id >= 0 ? <>Edit Question</> : <>Add Question</>;
  const [headerTitleJsx] = useState(markup);
  const [headerFixedJsx] = useState(<></>);

  return (
    <DrawerTemplateA
      drawerId="editQuestionDrawer"
      drawerOpenGlobalVariableName="editQuestionDrawerOpen"
      mainContentJsx={<EditQuestionDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditQuestionDrawer.propTypes = {
};

export default EditQuestionDrawer;
