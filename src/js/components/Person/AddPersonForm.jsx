import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import makeRequestParams from '../../react-query/makeRequestParams';
import { usePersonSaveMutation } from '../../react-query/mutations';

const AddPersonForm = ({ classes }) => {  //  classes, teamId
  renderLog('AddPersonForm');
  const { getAppContextValue } = useConnectAppContext();
  const { mutate } = usePersonSaveMutation();

  const [teamId, setTeamId] = useState(-1);
  const [teamName, setTeamName] = useState('');
  const [saveButtonActive, setSaveButtonActive] = React.useState(false);

  const firstNameFldRef = useRef('');
  const lastNameFldRef = useRef('');
  const emailFldRef = useRef('');

  useEffect(() => {  // Replaces onAppObservableStoreChange and will be called whenever the context value changes
    console.log('AddPersonForm: Context value changed:', true);
    setTeamId(getAppContextValue('addPersonDrawerTeam').id);
    setTeamName(getAppContextValue('addPersonDrawerTeam').teamName);
  }, [getAppContextValue]);


  const saveNewPerson = () => {
    const data = {
      firstName: firstNameFldRef.current.value,
      lastName: lastNameFldRef.current.value,
      emailPersonal: emailFldRef.current.value,
    };
    const plainParams = {
      personId: -1,
      teamId,
      teamName,
    };
    mutate(makeRequestParams(plainParams, data));
  };

  const updateSaveButton = () => {
    if (firstNameFldRef.current.value && firstNameFldRef.current.value.length &&
      lastNameFldRef.current.value && lastNameFldRef.current.value.length &&
      emailFldRef.current.value && emailFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };


  return (
    <AddPersonFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          autoFocus
          id="firstNameToBeSaved"
          inputRef={firstNameFldRef}
          label="First Name"
          margin="dense"
          name="firstNameToBeSaved"
          onChange={() => updateSaveButton()}
          placeholder="First Name"
          variant="outlined"
        />
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          id="lastNameToBeSaved"
          inputRef={lastNameFldRef}
          label="Last Name"
          margin="dense"
          name="lastNameToBeSaved"
          onChange={() => updateSaveButton()}
          placeholder="Last Name"
          variant="outlined"
        />
        <TextField
          // classes={{ root: classes.textField }} // Not working yet
          id="emailPersonalToBeSaved"
          inputRef={emailFldRef}
          label="Email Address, Personal"
          margin="dense"
          name="emailPersonalToBeSaved"
          onChange={() => updateSaveButton()}
          placeholder="Email Address, Personal"
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveNewPersonButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={saveNewPerson}
        >
          Save New Person
        </Button>
      </FormControl>
    </AddPersonFormWrapper>
  );
};
AddPersonForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveNewPersonButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const AddPersonFormWrapper = styled('div')`
`;

export default withStyles(styles)(AddPersonForm);
