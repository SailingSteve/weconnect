import React, { useEffect, useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditTaskDefinitionDrawerMainContent from '../Task/EditTaskDefinitionDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';


const EditTaskDefinitionDrawer = () => {
  renderLog('EditTaskDefinitionDrawer');  // Set LOG_RENDER_EVENTS to log all renders
  const [headerTitleJsx, setHeaderTitleJsx] = useState(<></>);
  const [headerFixedJsx] = useState(<></>);

  const { getAppContextValue } = useConnectAppContext();

  useEffect(() => {
    const taskGroup = getAppContextValue('editTaskDefinitionDrawerTaskGroup');
    if (taskGroup >= 0) {
      setHeaderTitleJsx(<>Edit Task</>);
    } else {
      setHeaderTitleJsx(<>Add Task</>);
    }
  }, []);


  return (
    <DrawerTemplateA
      drawerId="editTaskDefinitionDrawer"
      drawerOpenGlobalVariableName="editTaskDefinitionDrawerOpen"
      mainContentJsx={<EditTaskDefinitionDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditTaskDefinitionDrawer.propTypes = {
};

export default EditTaskDefinitionDrawer;
