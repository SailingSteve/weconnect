import React, { useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditQuestionnaireDrawerMainContent from '../Questionnaire/EditQuestionnaireDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const EditQuestionnaireDrawer = () => {
  renderLog('EditQuestionnaireDrawer');
  const { getAppContextValue } = useConnectAppContext();

  const selected = getAppContextValue('selectedQuestion');
  const [headerTitleJsx] = useState(selected ? <>Edit Questionnaire</> : <>Add Questionnaire</>);
  const [headerFixedJsx] = useState(<></>);

  return (
    <DrawerTemplateA
      drawerId="editQuestionnaireDrawer"
      drawerOpenGlobalVariableName="editQuestionnaireDrawerOpen"
      mainContentJsx={<EditQuestionnaireDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditQuestionnaireDrawer.propTypes = {
};

export default EditQuestionnaireDrawer;
