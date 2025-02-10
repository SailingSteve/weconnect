import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import {
  getFullNamePreferredPerson,
  // useGetFullNamePreferred,
} from '../../models/PersonModel';
import { useRemoveTeamMemberMutation } from '../../react-query/mutations';
import { DeleteStyled, EditStyled } from '../Style/iconStyles';
// import { useRemoveTeamMemberMutationDiverged } from '../../models/TeamModel';


const PersonSummaryRow = ({ person, rowNumberForDisplay, teamId }) => {
  renderLog('PersonSummaryRow');  // Set LOG_RENDER_EVENTS to log all renders
  // console.log('PersonSummaryRow location: ', person && person.location);

  // const [person, setPerson] = useState(useGetPersonById(personId));  2/5/2025 does not work
  const { setAppContextValue } = useConnectAppContext();
  const { mutate } = useRemoveTeamMemberMutation();

  const removeTeamMemberClick = () => {
    const params = { personId: person.personId, teamId };
    mutate(params);
  };

  const editPersonClick = (hasEditRights = true) => {
    if (hasEditRights) {
      setAppContextValue('editPersonDrawerOpen', true);
      setAppContextValue('personDrawersPerson', person);
      setAppContextValue('personDrawersPersonId', person.personId);
    }
  };

  const personProfileClick = () => {
    setAppContextValue('personProfileDrawerOpen', true);
    setAppContextValue('personDrawersPerson', person);
    setAppContextValue('personDrawersPersonId', person.personId);
  };

  // useEffect(() => {
  //   console.log('PersonSummaryRow person: ', person, ' useEffect apiDataCache:', apiDataCache);
  //   const { allPeopleCache } = apiDataCache;
  //   if (allPeopleCache) {
  //     setPerson(allPeopleCache[personId] || {});
  //   }
  // }, [apiDataCache]);

  const hasEditRights = true;
  return (
    <OnePersonWrapper key={`teamMember-${person.personId}`}>
      {rowNumberForDisplay && (
        <PersonCell id={`index-personId-${person.personId}`} cellwidth={15}>
          <GraySpan>
            {rowNumberForDisplay}
          </GraySpan>
        </PersonCell>
      )}
      <PersonCell
        id={`fullNamePreferred-personId-${person.personId}`}
        onClick={() => personProfileClick(person)}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          color: DesignTokenColors.primary500,
        }}
        // cellwidth="200"
        cellwidth={200}
      >
        {/* {`${person.firstName} ${person.lastName}`} */}
        {getFullNamePreferredPerson(person)} {/* 2/6/25 currently if you save a first name preferred, it shows up here, but will not be searchable on add team member If you */}
      </PersonCell>
      <PersonCell
        id={`location-personId-${person.personId}`}
        smallfont="true" // $smallfont gets rid of error message, but doesn't get passed to PersonCell styled div
        // cellwidth="300"
        cellwidth={300}
      >
        {person.location}
      </PersonCell>
      <PersonCell
        id={`jobTitle-personId-${person.personId}`}
        smallestfont="true" // $smallestfont gets rid of error message, but doesn't get passed to PersonCell styled div
        // cellwidth="225"
        cellwidth={225}
      >
        {person.jobTitle}
      </PersonCell>
      {hasEditRights ? (
        <PersonCell
          id={`editPerson-personId-${person.personId}`}
          onClick={() => editPersonClick(hasEditRights)}
          style={{ cursor: 'pointer' }}
          // cellwidth="20"
          cellwidth={20}
        >
          <EditStyled />
        </PersonCell>
      ) : (
        <PersonCell
          id={`editPerson-personId-${person.personId}`}
          // cellwidth="20"
          cellwidth={20}
        >
          &nbsp;
        </PersonCell>
      )}
      {teamId > 0 && (
        <>
          {hasEditRights ? (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              onClick={() => removeTeamMemberClick(person)}
              style={{ cursor: 'pointer' }}
              // cellwidth="20"
              cellwidth={20}
            >
              <DeleteStyled />
            </PersonCell>
          ) : (
            <PersonCell
              id={`removeMember-personId-${person.personId}`}
              onClick={() => removeTeamMemberClick(person)}
              // cellwidth="20"
              cellwidth={20}
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

const GraySpan = styled('span')`
  color: ${DesignTokenColors.neutral400};
`;

const OnePersonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const PersonCell = styled('div', {
  shouldForwardProp: (prop) => !['smallfont', 'smallestfont', 'cellwidth'].includes(prop),
})(({ smallfont, smallestfont, cellwidth }) => (`
  align-content: center;
  border-bottom: 1px solid #ccc;
  ${(smallfont && !smallestfont) ? 'font-size: .9em;' : ''}
  ${(smallestfont && !smallfont) ? 'font-size: .8em;' : ''}
  height: 22px;
  ${cellwidth ? `max-width: ${cellwidth}px;` : ''}
  ${cellwidth ? `min-width: ${cellwidth}px;` : ''}
  overflow: hidden;
  white-space: nowrap;
  ${cellwidth ? `width: ${cellwidth}px;` : ''}
`));

export default withStyles(styles)(PersonSummaryRow);
