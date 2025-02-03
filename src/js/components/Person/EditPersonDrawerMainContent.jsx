import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import EditPersonForm from './EditPersonForm';


const EditPersonDrawerMainContent = () => {
  renderLog('EditPersonDrawerMainContent');
  const { getAppContextValue } = useConnectAppContext();

  // eslint-disable-next-line no-unused-vars
  const [teamId, setTeamId] = useState(-1);

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    // console.log('EditPersonDrawerMainContent: Context value changed:', true);
    const teamIdTemp = getAppContextValue('editPersonDrawerTeamId');
    setTeamId(teamIdTemp);
  });
  // }, [getAppContextValue]);  // TODO DALE: commented out for now to avoid infinite loop

  return (
    <EditPersonDrawerMainContentWrapper>
      <EditPersonWrapper>
        <EditPersonForm />
      </EditPersonWrapper>
    </EditPersonDrawerMainContentWrapper>
  );
};

const EditPersonDrawerMainContentWrapper = styled('div')`
`;

const EditPersonWrapper = styled('div')`
  margin-top: 32px;
`;

export default EditPersonDrawerMainContent;
