import React, { useEffect, useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditTaskDefinitionDrawerMainContent from '../Task/EditTaskDefinitionDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const EditTaskDefinitionDrawer = () => {
  renderLog('EditTaskDefinitionDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue } = useConnectAppContext();

  return (
    <DrawerTemplateA
      drawerId="editTaskDefinitionDrawer"
      drawerOpenGlobalVariableName="editTaskDefinitionDrawerOpen"
      mainContentJsx={<EditTaskDefinitionDrawerMainContent />}
      headerTitleJsx={getAppContextValue('editTaskDefinitionDrawerLabel')}
      headerFixedJsx={<></>}
    />
  );
};
EditTaskDefinitionDrawer.propTypes = {
};

export default EditTaskDefinitionDrawer;
