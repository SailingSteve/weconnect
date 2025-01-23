import React from 'react';
import { renderLog } from '../../common/utils/logging';
import AddPersonDrawerMainContent from '../Person/AddPersonDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const AddPersonDrawer = () => {
  renderLog('AddPersonDrawer');  // Set LOG_RENDER_EVENTS to log all renders

  return (
    <DrawerTemplateA
      drawerId="addPersonDrawer"
      drawerOpenGlobalVariableName="addPersonDrawerOpen"
      mainContentJsx={<AddPersonDrawerMainContent />}
      headerTitleJsx={<>Add Team Member</>}
      headerFixedJsx={<></>}
    />
  );
};

export default AddPersonDrawer;
