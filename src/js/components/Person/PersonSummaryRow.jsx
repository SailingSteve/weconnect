import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Delete, Edit } from '@mui/icons-material';
import { withStyles } from '@mui/styles';
import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import PersonStore from '../../stores/PersonStore';
import TeamActions from '../../actions/TeamActions';
import TeamStore from '../../stores/TeamStore';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';


const PersonSummaryRow = ({ person, rowNumberForDisplay, teamId }) => {
  renderLog('PersonSummaryRow');  // Set LOG_RENDER_EVENTS to log all renders
  // const [person, setPerson] = React.useState({});

  const onAppObservableStoreChange = () => {
  };

  const onPersonStoreChange = () => {
  };

  const onTeamStoreChange = () => {
  };

  const editPersonClick = (personId, hasEditRights = true) => {
    if (hasEditRights) {
      AppObservableStore.setGlobalVariableState('editPersonDrawerOpen', true);
      AppObservableStore.setGlobalVariableState('editPersonDrawerPersonId', personId);
    }
  };

  const personProfileClick = (personId) => {
    AppObservableStore.setGlobalVariableState('personProfileDrawerOpen', true);
    AppObservableStore.setGlobalVariableState('personProfileDrawerPersonId', personId);
  };

  React.useEffect(() => {
    // setTeamMemberList([]);
    const appStateSubscription = messageService.getMessage().subscribe(() => onAppObservableStoreChange());
    onAppObservableStoreChange();
    const personStoreListener = PersonStore.addListener(onPersonStoreChange);
    onPersonStoreChange();
    const teamStoreListener = TeamStore.addListener(onTeamStoreChange);
    onTeamStoreChange();

    return () => {
      appStateSubscription.unsubscribe();
      personStoreListener.remove();
      teamStoreListener.remove();
    };
  }, []);

  const hasEditRights = true;
  return (
    <OnePersonWrapper key={`teamMember-${person.personId}`}>
      {rowNumberForDisplay && (
        <PersonCell id={`index-personId-${person.personId}`} width={15}>
          <GraySpan>
            {rowNumberForDisplay}
          </GraySpan>
        </PersonCell>
      )}
      <PersonCell
        id={`fullNamePreferred-personId-${person.personId}`}
        onClick={() => personProfileClick(person.personId)}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          color: DesignTokenColors.primary500,
        }}
        width={150}
      >
        {PersonStore.getFullNamePreferred(person.personId)}
      </PersonCell>
      <PersonCell id={`location-personId-${person.personId}`} smallFont width={125}>
        {PersonStore.getPersonById(person.personId).location}
      </PersonCell>
      <PersonCell id={`jobTitle-personId-${person.personId}`} smallestFont width={190}>
        {PersonStore.getPersonById(person.personId).jobTitle}
      </PersonCell>
      {hasEditRights ? (
        <PersonCell
          id={`editPerson-personId-${person.personId}`}
          onClick={() => editPersonClick(person.personId, hasEditRights)}
          style={{ cursor: 'pointer' }}
          width={20}
        >
          <EditStyled />
        </PersonCell>
      ) : (
        <PersonCell
          id={`editPerson-personId-${person.personId}`}
          width={20}
        >
          &nbsp;
        </PersonCell>
      )}
      {teamId && (
        <>
          {hasEditRights ? (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              onClick={() => TeamActions.removePersonFromTeam(person.personId, teamId)}
              style={{ cursor: 'pointer' }}
              width={20}
            >
              <DeleteStyled />
            </PersonCell>
          ) : (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              width={20}
            >
              &nbsp;
            </PersonCell>
          )}
        </>
      )}
    </OnePersonWrapper>
  );
};
PersonSummaryRow.propTypes = {
  person: PropTypes.object.isRequired,
  rowNumberForDisplay: PropTypes.number,
  teamId: PropTypes.number,
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

const DeleteStyled = styled(Delete)`
  color: ${DesignTokenColors.neutral200};
  width: 20px;
  height: 20px;
`;

const EditStyled = styled(Edit)`
  color: ${DesignTokenColors.neutral100};
  height: 16px;
  margin-left: 2px;
  width: 16px;
`;

const GraySpan = styled('span')`
  color: ${DesignTokenColors.neutral400};
`;

const OnePersonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PersonCell = styled('div', {
  shouldForwardProp: (prop) => !['smallFont', 'smallestFont', 'width'].includes(prop),
})(({ smallFont, smallestFont, width }) => (`
  align-content: center;
  border-bottom: 1px solid #ccc;
  ${(smallFont && !smallestFont) ? 'font-size: .9em;' : ''};
  ${(smallestFont && !smallFont) ? 'font-size: .8em;' : ''};
  height: 22px;
  ${width ? `max-width: ${width}px;` : ''};
  ${width ? `min-width: ${width}px;` : ''};
  overflow: hidden;
  white-space: nowrap;
  ${width ? `width: ${width}px;` : ''};
`));

export default withStyles(styles)(PersonSummaryRow);
