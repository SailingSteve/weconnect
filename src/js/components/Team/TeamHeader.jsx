import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import { useRemoveTeamMutation } from '../../react-query/mutations';
import { DeleteStyled, EditStyled } from '../Style/iconStyles';


// eslint-disable-next-line no-unused-vars
const TeamHeader = ({ classes, showHeaderLabels, showIcons, team }) => {
  renderLog('TeamHeader');
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();
  const { mutate } = useRemoveTeamMutation();

  let teamLocal = team;
  if (!teamLocal || !teamLocal.teamName) {
    teamLocal = getAppContextValue('teamForAddTeamDrawer');
  }

  const removeTeamClick = () => {
    console.log('removeTeamMutation team: ', teamLocal.id);
    mutate({ teamId: teamLocal.id });
  };

  const editTeamClick = () => {
    console.log('editTeamClick: ', teamLocal);
    setAppContextValue('addTeamDrawerOpen', true);
    setAppContextValue('AddTeamDrawerLabel', 'Edit Team Name');
    setAppContextValue('teamForAddTeamDrawer', teamLocal);
  };

  // console.log('TeamHeader teamLocal.teamName ', teamLocal.teamName);
  return (
    <OneTeamHeader>
      {/* Width (below) of this TeamHeaderCell comes from the combined widths of the first x columns in TeamMemberList */}
      <TeamHeaderCell cellwidth={215} largefont="true" titlecell="true">
        {teamLocal && (
          <Link to={`/team-home/${teamLocal.id}`}>
            {teamLocal.teamName}
          </Link>
        )}
      </TeamHeaderCell>
      <TeamHeaderCell cellwidth={300}>
        {showHeaderLabels ? 'Location' : ''}
      </TeamHeaderCell>
      <TeamHeaderCell cellwidth={225}>
        {showHeaderLabels ? 'Title / Volunteering Love' : ''}
      </TeamHeaderCell>
      {/* Edit icon */}
      {showIcons && (
        <TeamHeaderCell cellwidth={20} onClick={editTeamClick}>
          <EditStyled />
        </TeamHeaderCell>
      )}
      {/* Delete icon */}
      {showIcons && (
        <TeamHeaderCell cellwidth={20} onClick={removeTeamClick}>
          <DeleteStyled />
        </TeamHeaderCell>
      )}
    </OneTeamHeader>
  );
};
TeamHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  showHeaderLabels: PropTypes.bool,
  team: PropTypes.object,
  showIcons: PropTypes.bool,
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
});

const OneTeamHeader = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
`;

const TeamHeaderCell = styled('div', {
  shouldForwardProp: (prop) => !['largefont', 'titlecell', 'cellwidth'].includes(prop),
})(({ largefont, titlecell, cellwidth }) => (`
  align-content: center;
  ${(titlecell) ? '' : 'border-bottom: 1px solid #ccc;'}
  ${(largefont) ? 'font-size: 1.1em;' : 'font-size: .8em;'}
  ${(titlecell) ? '' : 'font-weight: 550;'}
  height: 22px;
  ${cellwidth ? `max-width: ${cellwidth}px;` : ''}
  ${cellwidth ? `min-width: ${cellwidth}px;` : ''}
  overflow: hidden;
  white-space: nowrap;
  ${cellwidth ? `width: ${cellwidth}px;` : ''}
`));

export default withStyles(styles)(TeamHeader);
