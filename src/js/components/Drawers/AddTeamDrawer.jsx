import React from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import AddTeamDrawerMainContent from '../Team/AddTeamDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const AddTeamDrawer = () => {
  renderLog('AddTeamDrawer');
  const { getAppContextValue } = useConnectAppContext();

  return (
    <DrawerTemplateA
      drawerId="addTeamDrawer"
      drawerOpenGlobalVariableName="addTeamDrawerOpen"
      mainContentJsx={<AddTeamDrawerMainContent />}
      headerTitleJsx={<>{getAppContextValue('AddTeamDrawerLabel')}</>}
      headerFixedJsx={<></>}
    />
  );
};

export default AddTeamDrawer;
