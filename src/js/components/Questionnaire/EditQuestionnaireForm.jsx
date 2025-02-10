import { Button, FormControl, TextField } from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import makeRequestParams from '../../react-query/makeRequestParams';
import { useQuestionnaireSaveMutation } from '../../react-query/mutations';


const EditQuestionnaireForm = ({ classes }) => {
  renderLog('EditQuestionnaireForm');
  const { getAppContextValue, setAppContextValue } = useConnectAppContext();
  const { mutate } = useQuestionnaireSaveMutation();

  const [questionnaire]  = useState(getAppContextValue('selectedQuestionnaire'));
  const [saveButtonActive, setSaveButtonActive] = useState(false);
  const [nameFldValue, setNameFldValue] = useState('');
  const [titleFldValue, setTitleFldValue] = useState('');
  const [instructionsFldValue, setInstructionsFldValue] = useState('');

  const nameFldRef = useRef('');
  const titleFldRef = useRef('');
  const instructionsFldRef = useRef('');

  useEffect(() => {
    if (questionnaire) {
      setNameFldValue(questionnaire.questionnaireName);
      setTitleFldValue(questionnaire.questionnaireTitle);
      setInstructionsFldValue(questionnaire.questionnaireInstructions);
    } else {
      setNameFldValue('');
      setTitleFldValue('');
      setInstructionsFldValue('');
    }
  }, [questionnaire]);

  const saveQuestionnaire = () => {
    const params = {
      questionnaireName: nameFldRef.current.value,
      questionnaireTitle: titleFldRef.current.value,
      questionnaireInstructions: instructionsFldRef.current.value,
    };
    const plainParams = {
      questionnaireId: questionnaire ? questionnaire.id : '-1',
    };
    mutate(makeRequestParams(plainParams, params));
    setSaveButtonActive(false);
    setAppContextValue('editQuestionnaireDrawerOpen', false);
    setAppContextValue('selectedQuestionnaire', undefined);
    setAppContextValue('editQuestionnaireDrawerLabel', '');
  };

  const updateSaveButton = () => {
    if (nameFldRef.current.value && nameFldRef.current.value.length &&
      titleFldRef.current.value && titleFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  return (
    <EditQuestionnaireFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={nameFldValue}
          id="questionnaireNameToBeSaved"
          inputRef={nameFldRef}
          label="Questionnaire Internal Name"
          margin="dense"
          name="questionnaireName"
          onChange={() => updateSaveButton()}
          placeholder="Name of the questionnaire, staff only"
          variant="outlined"
        />
        <TextField
          defaultValue={titleFldValue}
          id="questionnaireTitleToBeSaved"
          inputRef={titleFldRef}
          label="Questionnaire Visible Title"
          margin="dense"
          multiline
          name="questionnaireTitle"
          onChange={() => updateSaveButton()}
          placeholder="Title shown"
          rows={2}
          variant="outlined"
        />
        <TextField
          defaultValue={instructionsFldValue}
          id="questionnaireInstructionsToBeSaved"
          inputRef={instructionsFldRef}
          label="Instructions"
          margin="dense"
          multiline
          name="questionnaireInstructions"
          onChange={() => updateSaveButton()}
          placeholder="Instructions for filling out questionnaire"
          rows={6}
          variant="outlined"
        />
        <Button
          classes={{ root: classes.saveQuestionnaireButton }}
          color="primary"
          disabled={!saveButtonActive}
          onClick={saveQuestionnaire}
          variant="contained"
        >
          Save Questionnaire
        </Button>
      </FormControl>
    </EditQuestionnaireFormWrapper>
  );
};
EditQuestionnaireForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
  saveQuestionnaireButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const EditQuestionnaireFormWrapper = styled('div')`
`;

export default withStyles(styles)(EditQuestionnaireForm);
