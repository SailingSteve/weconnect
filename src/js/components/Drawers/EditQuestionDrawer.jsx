import React, { useEffect, useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditQuestionDrawerMainContent from '../Questionnaire/EditQuestionDrawerMainContent';
import DrawerTemplateA from './DrawerTemplateA';

const EditQuestionDrawer = () => {
  renderLog('EditQuestionDrawer');
  const { getAppContextValue } = useConnectAppContext();

  const [headerTitleJsx, setHeaderTitleJsx] = useState(<></>);
  const [headerFixedJsx] = useState(<></>);

  useEffect(() => {
    // console.log('EditQuestionDrawer: Context value changed:', true);
    const question = getAppContextValue('selectedQuestion');
    // if (question && question.id >= 0) {
    //   setHeaderTitleJsx(<>Edit Question</>);
    // } else {
    //   setHeaderTitleJsx(<>Add Question</>);
    // }
  });
  // }, [getAppContextValue]);  // TODO DALE: commented out for now to avoid infinite loop

  return (
    <DrawerTemplateA
      drawerId="editQuestionDrawer"
      drawerOpenGlobalVariableName="editQuestionDrawerOpen"
      mainContentJsx={<EditQuestionDrawerMainContent />}
      headerTitleJsx={headerTitleJsx}
      headerFixedJsx={headerFixedJsx}
    />
  );
};
EditQuestionDrawer.propTypes = {
};

export default EditQuestionDrawer;
