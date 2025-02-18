import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import makeRequestParams from '../../react-query/makeRequestParams';
import { usePersonSaveMutation } from '../../react-query/mutations';
// import { useGetPersonById, usePersonSave } from '../../models/PersonModel';

const EditPersonForm = ({ classes }) => {
  renderLog('EditPersonForm');
  const { getAppContextValue } = useConnectAppContext();
  const { mutate } = usePersonSaveMutation();
  // const { mutate: personSave } = usePersonSave();

  const [saveButtonActive, setSaveButtonActive] = useState(false);
  const [initialPerson] = useState(getAppContextValue('personDrawersPerson'));
  // const [initialPerson] = useState(useGetPersonById(getAppContextValue('personDrawersPersonId')));
  const [activePerson, setActivePerson] = useState({ ...initialPerson });

  const emailPersonal = useRef('');
  const firstName = useRef('');
  const firstNamePreferred = useRef('');
  const jobTitle = useRef('');
  const lastName = useRef('');
  const location = useRef('');
  const stateCode = useRef('');

  const savePerson = () => {
    activePerson.emailPersonal = emailPersonal.current.value;
    activePerson.firstName = firstName.current.value;
    activePerson.firstNamePreferred = firstNamePreferred.current.value;
    activePerson.jobTitle = jobTitle.current.value;
    activePerson.lastName = lastName.current.value;
    activePerson.location = location.current.value;
    activePerson.stateCode = stateCode.current.value;
    setActivePerson(activePerson);

    // console.log('savePerson data:', JSON.stringify(activePerson));

    const data = {};
    Object.keys(activePerson).forEach((key) => {
      const initialValue = initialPerson[key] || '';
      const activeValue = activePerson[key] || '';
      if (initialValue !== activeValue) {
        data[key] = activeValue;
      }
    });
    const plainParams = {
      personId: activePerson.id,
    };

    mutate(makeRequestParams(plainParams, data));
    setSaveButtonActive(false);
  };

  return (
    <EditPersonFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={activePerson.firstName || ''}
          id="firstNameToBeSaved"
          inputRef={firstName}
          label="First (Legal) Name"
          margin="dense"
          name="firstName"
          onChange={() => setSaveButtonActive(true)}
          placeholder="First Name (legal name)"
          variant="outlined"
        />
        <TextField
          defaultValue={activePerson.firstNamePreferred || ''}
          id="firstNamePreferredToBeSaved"
          inputRef={firstNamePreferred}
          label="First (Preferred) if different from legal"
          margin="dense"
          name="firstNamePreferred"
          onChange={() => setSaveButtonActive(true)}
          placeholder="First Name to use in meetings"
          variant="outlined"
        />
        <TextField
          defaultValue={activePerson.lastName || ''}
          id="lastNameToBeSaved"
          inputRef={lastName}
          label="Last Name"
          margin="dense"
          name="lastName"
          onChange={() => setSaveButtonActive(true)}
          placeholder="Last Name"
          variant="outlined"
        />
        <TextField
          defaultValue={activePerson.emailPersonal || ''}
          id="emailPersonalToBeSaved"
          label="Email Address, Personal"
          name="emailPersonal"
          inputRef={emailPersonal}
          margin="dense"
          variant="outlined"
          onChange={() => setSaveButtonActive(true)}
          placeholder="Email Address, Personal"
        />
        <TextField
          defaultValue={activePerson.location || ''}
          id="locationToBeSaved"
          inputRef={location}
          label="Location"
          margin="dense"
          name="location"
          onChange={() => setSaveButtonActive(true)}
          placeholder="City, State"
          variant="outlined"
        />
        <TextField
          defaultValue={activePerson.stateCode || ''}
          id="stateCodeToBeSaved"
          inputRef={stateCode}
          label="State Code"
          margin="dense"
          name="stateCode"
          onChange={() => setSaveButtonActive(true)}
          placeholder="State Code (2 characters)"
          variant="outlined"
        />
        <TextField
          defaultValue={activePerson.jobTitle || ''}
          id="jobTitleToBeSaved"
          inputRef={jobTitle}
          label={`Job Title (at ${webAppConfig.ORGANIZATION_NAME})`}
          margin="dense"
          name="jobTitle"
          onChange={() => setSaveButtonActive(true)}
          placeholder={`Job Title here at ${webAppConfig.ORGANIZATION_NAME}`}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.savePersonButton }}
          color="primary"
          disabled={!saveButtonActive}
          onClick={savePerson}
          variant="contained"
        >
          Save Person
        </Button>
      </FormControl>
    </EditPersonFormWrapper>
  );
};
EditPersonForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  savePersonButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EditPersonFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditPersonForm);
