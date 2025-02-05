import React, { useEffect, useState } from 'react';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import DrawerTemplateA from './DrawerTemplateA';
import { renderLog } from '../../common/utils/logging';
import EditQuestionnaireDrawerMainContent from '../Questionnaire/EditQuestionnaireDrawerMainContent';


const EditQuestionnaireDrawer = () => {
  renderLog('EditQuestionnaireDrawer');
  const { getAppContextValue } = useConnectAppContext();

  const selected = getAppContextValue('selectedQuestionnaire');
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
