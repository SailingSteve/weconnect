import React from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditTaskGroupDrawerMainContent from '../Task/EditTaskGroupDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const EditTaskGroupDrawer = () => {
  renderLog('EditTaskGroupDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();

  return (
    <DrawerTemplateA
      drawerId="editTaskGroupDrawer"
      drawerOpenGlobalVariableName="editTaskGroupDrawerOpen"
      headerFixedJsx={<></>}
      headerTitleJsx={<>{getAppContextValue('editTaskGroupDrawerLabel')}</>}
      mainContentJsx={<EditTaskGroupDrawerMainContent />}
    />
  );
};
EditTaskGroupDrawer.propTypes = {
};

export default EditTaskGroupDrawer;
