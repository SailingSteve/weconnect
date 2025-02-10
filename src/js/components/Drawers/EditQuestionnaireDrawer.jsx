import React from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditQuestionnaireDrawerMainContent from '../Questionnaire/EditQuestionnaireDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const EditQuestionnaireDrawer = () => {
  renderLog('EditQuestionnaireDrawer');
  const { getAppContextValue } = useConnectAppContext();

  return (
    <DrawerTemplateA
      drawerId="editQuestionnaireDrawer"
      drawerOpenGlobalVariableName="editQuestionnaireDrawerOpen"
      headerFixedJsx={<></>}
      headerTitleJsx={<>{getAppContextValue('editQuestionnaireDrawerLabel')}</>}
      mainContentJsx={<EditQuestionnaireDrawerMainContent />}
    />
  );
};
EditQuestionnaireDrawer.propTypes = {
};

export default EditQuestionnaireDrawer;
