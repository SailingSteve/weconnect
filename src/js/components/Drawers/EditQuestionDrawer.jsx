import React from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditQuestionDrawerMainContent from '../Questionnaire/EditQuestionDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';

const EditQuestionDrawer = () => {
  renderLog('EditQuestionDrawer');
  const { getAppContextValue } = useConnectAppContext();

  return (
    <DrawerTemplateA
      drawerId="editQuestionDrawer"
      drawerOpenGlobalVariableName="editQuestionDrawerOpen"
      headerFixedJsx={<></>}
      headerTitleJsx={<>{getAppContextValue('editQuestionDrawerLabel')}</>}
      mainContentJsx={<EditQuestionDrawerMainContent />}
    />
  );
};
EditQuestionDrawer.propTypes = {
};

export default EditQuestionDrawer;
