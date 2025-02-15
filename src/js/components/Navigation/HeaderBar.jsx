import { Button, Tab, Tabs } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import standardBoxShadow from '../../common/components/Style/standardBoxShadow';
import { hasIPhoneNotch } from '../../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../../common/utils/hrefUtils';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { useLogoutMutation } from '../../react-query/mutations';
import weConnectQueryFn, { METHOD } from '../../react-query/WeConnectQuery';
import { displayTopMenuShadow } from '../../utils/applicationUtils';
import { TopOfPageHeader, TopRowOneLeftContainer, TopRowOneMiddleContainer, TopRowOneRightContainer, TopRowTwoLeftContainer } from '../Style/pageLayoutStyles';
import HeaderBarLogo from './HeaderBarLogo';


// eslint-disable-next-line no-unused-vars
const HeaderBar = (classes) => {
  renderLog('HeaderBar');
  const navigate = useNavigate();
  const { setAppContextValue, getAppContextValue } = useConnectAppContext();
  const { mutate: mutateLogout } = useLogoutMutation();

  const [scrolledDown] = useState(false);
  const [tabsValue, setTabsValue] = useState('1');
  const [showTabs] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isAuth = getAppContextValue('isAuthenticated');
  useEffect(() => {
    if (isAuth !== null) {
      console.log('----------- isAuthenticated changed =', isAuth);
      setIsAuthenticated(isAuth);
    }
  }, [isAuth]);

  const logoutApi = async () => {
    const data = await weConnectQueryFn('logout', {}, METHOD.POST);
    console.log(`/logout response in HeaderBar -- status: '${'status'}',  data: ${JSON.stringify(data)}`);
    setAppContextValue('isAuthenticated', false);
    navigate('/login');
    mutateLogout();
  };

  const initializeTabValue = () => {
    // console.log('initializeTabValue normalizedHrefPage():', normalizedHrefPage());
    switch (normalizedHrefPage()) {
      case 'tasks':
        setTabsValue('1');
        // console.log('initializeTabValue  setTabsValue: 1');
        break;
      case 'team-home':
      case 'teams':
        setTabsValue('2');
        // console.log('initializeTabValue  setTabsValue: 2');
        break;
      case 'questionnaire':
      case 'system-settings':
      case 'task-group':
        setTabsValue('3');
        // console.log('initializeTabValue  setTabsValue: 3');
        break;
      default:
        setTabsValue('1');
        // console.log('initializeTabValue  setTabsValue default: 1');
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    // console.log(`handleTabChange newValue: ${newValue}`);
    // setTabsValue(newValue);
    switch (newValue) {
      case '1':
        navigate('/tasks');
        break;
      case '2':
        navigate('/teams');
        break;
      case '3':
        navigate('/system-settings');
        break;
      default:
        navigate('/tasks');
        break;
    }
    initializeTabValue();
  };

  useEffect(() => {
    initializeTabValue();
  }, []);

  return (
    <HeaderBarWrapper
      $hasNotch={hasIPhoneNotch()}
      $scrolledDown={scrolledDown}
      $hasSubmenu={displayTopMenuShadow()}
    >
      <TopOfPageHeader>
        <TopRowOneLeftContainer>
          <HeaderBarLogo linkOff={!showTabs} />
        </TopRowOneLeftContainer>
        <TopRowOneMiddleContainer>
          {showTabs && (
            <Tabs value={tabsValue} onChange={handleTabChange} aria-label="Tabs selector">
              <Tab value="1" label="Dashboard" />
              <Tab value="2" label="Teams" />
              <Tab value="3" label="Settings" />
            </Tabs>
          )}
        </TopRowOneMiddleContainer>
        <TopRowOneRightContainer className="u-cursor--pointer">
          <Button
            variant="outlined"
            sx={{ border: 'none' }}
            id="signInButton"
            onClick={() => (isAuthenticated ? logoutApi() : navigate('/login'))}
          >
            {isAuthenticated ? 'Sign Out' : 'Sign In'}
          </Button>
        </TopRowOneRightContainer>
        <TopRowTwoLeftContainer>
         &nbsp;
        </TopRowTwoLeftContainer>
      </TopOfPageHeader>
    </HeaderBarWrapper>
  );
};

const styles = (theme) => ({
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  addTeamButtonRoot: {
    width: 120,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  navButtonOutlined: {
    height: 32,
    borderRadius: 32,
    color: 'white',
    backgroundColor: 'yellow',
    border: '1px solid white',
    marginBottom: '1em',
    fontWeight: '300',
    width: '47%',
    fontSize: 12,
    padding: '5px 0',
    marginTop: 8,
  },
  navClose: {
    position: 'fixed',
    right: 16,
    cursor: 'pointer',
  },
});

const HeaderBarWrapper = styled('div', {
  shouldForwardProp: (prop) => !['hasNotch', 'scrolledDown', 'hasSubmenu'].includes(prop),
})(({ hasNotch, scrolledDown, hasSubmenu }) => (`
  margin-top: ${hasNotch ? '9%' : ''};
  box-shadow: ${(!scrolledDown || !hasSubmenu)  ? '' : standardBoxShadow('wide')};
  border-bottom: ${(!scrolledDown || !hasSubmenu) ? '' : '1px solid #aaa'};
`));


export default withStyles(styles)(HeaderBar);
