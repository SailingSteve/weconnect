import React from 'react';
import { renderLog } from '../../common/utils/logging';
import AddPersonDrawerMainContent from '../Person/AddPersonDrawerMainContent';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import DrawerTemplateA from './DrawerTemplateA';


const AddPersonDrawer = () => {
  renderLog('AddPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();

  const onDrawerClose = () => {
    setAppContextValue('addPersonDrawerTeam', undefined);
  };

  return (
    <DrawerTemplateA
      drawerId="addPersonDrawer"
      drawerOpenGlobalVariableName="addPersonDrawerOpen"
      mainContentJsx={<AddPersonDrawerMainContent />}
      headerTitleJsx={<>{getAppContextValue('AddPersonDrawerLabel')}</>}
      headerFixedJsx={<></>}
      onDrawerClose={onDrawerClose}
    />
  );
};

export default AddPersonDrawer;
