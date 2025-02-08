import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { renderLog } from '../../common/utils/logging';
import cordovaTopHeaderTopMargin from '../../utils/cordovaTopHeaderTopMargin';
import { HeadroomWrapper } from '../Style/pageLayoutStyles';
import IPhoneSpacer from '../Widgets/IPhoneSpacer';
import HeaderBar from './HeaderBar';


const Header = ({ hideHeader }) => {
  renderLog('Header');  // Set LOG_RENDER_EVENTS to log all renders
  const [pageHeaderClasses] = useState('');

  return (
    <div id="app-header">
      <IPhoneSpacer />
      <HeadroomWrapper id="hw1">
        <div className={pageHeaderClasses} style={cordovaTopHeaderTopMargin()} id="header-container">
          <HeaderBar style={hideHeader ? { display: 'none' } : { display: 'unset' }} />
        </div>
      </HeadroomWrapper>
    </div>
  );
};
Header.propTypes = {
  hideHeader: PropTypes.bool,
};

export default Header;
