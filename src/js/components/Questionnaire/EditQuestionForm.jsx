import { ContentCopy } from '@mui/icons-material';
import { Button, Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from '@mui/material'; // FormLabel, Radio, RadioGroup,
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import { renderLog } from '../../common/utils/logging';
import { useConnectAppContext } from '../../contexts/ConnectAppContext';
import makeRequestParams from '../../react-query/makeRequestParams';
import { useQuestionSaveMutation } from '../../react-query/mutations';
import { SpanWithLinkStyle } from '../Style/linkStyles';

const PERSON_FIELDS_ACCEPTED = [
  'firstName',
  'firstNamePreferred',
  'emailPersonal',
  'hoursPerWeekEstimate',
  'jobTitle',
  'lastName',
  'location',
  'stateCode',
  'zipCode',
];

// const QUESTION_FIELDS_IN_FORM = [
//   'answerType', 'fieldMappingRule',
//   'questionInstructions', 'questionText',
//   'requireAnswer', 'statusActive'];

const EditQuestionForm = ({ classes }) => {
  renderLog('EditQuestionForm');
  const {  getAppContextValue } = useConnectAppContext();
  const { mutate } = useQuestionSaveMutation();

  const [question] = useState(getAppContextValue('selectedQuestion'));
  const [questionnaire] = useState(getAppContextValue('selectedQuestionnaire'));
  const [fieldMappingRuleValue, setFieldMappingRuleValue] = useState('');
  const [questionInstructionsValue, setQuestionInstructionsValue] = useState('');
  const [questionTextValue, setQuestionTextValue] = useState('');
  const [requireAnswerValue, setRequireAnswerValue] = useState(false);
  const [statusActiveValue, setStatusActiveValue]  = useState(true);

  // eslint-disable-next-line no-unused-vars
  const [fieldMappingRuleCopied, setFieldMappingRuleCopied] = useState('');
  const [saveButtonActive, setSaveButtonActive] = useState(false);
  const [showFieldMappingOptions, setShowFieldMappingOptions] = useState(false);
  const [radioValue, setRadioValue] = useState();

  const fieldMappingRuleFldRef = useRef('');
  const questionInstructionsFldRef = useRef('');
  const questionTextFldRef = useRef('');
  const requireAnswerFldRef = useRef(false);
  const statusActiveFldRef = useRef(true);
  const formatRadioFldRef = useRef(true);

  useEffect(() => {
    if (question) {
      setRadioValue(question.answerType);
      setFieldMappingRuleValue(question.fieldMappingRule);
      setQuestionInstructionsValue(question.questionInstructions);
      setQuestionTextValue(question.questionText);
      setRequireAnswerValue(question.requireAnswer);
      setStatusActiveValue(question.statusActive);
    } else {
      setRadioValue('STRING');
      setFieldMappingRuleValue('');
      setQuestionInstructionsValue('');
      setQuestionTextValue('');
      setRequireAnswerValue(false);
      setStatusActiveValue(true);
    }
  }, [question]);

  // eslint-disable-next-line no-unused-vars
  const copyFieldMappingRule = (fieldMappingRule) => {
  //   // console.log('EditQuestionForm copyFieldMappingRule');
  //   // openSnackbar({ message: 'Copied!' });
  //   setFieldMappingRuleCopied(fieldMappingRule);
  //   setInputValues({ ...inputValues, ['fieldMappingRule']: fieldMappingRule });
  //   // Hack 1/14/25 to get compile
  //   // AppObservableStore.setGlobalVariableState('fieldMappingRuleChanged', true);
  //   // AppObservableStore.setGlobalVariableState('fieldMappingRuleToBeSaved', fieldMappingRule);
  //   // End Hack 1/14/25 to get compile
  //   setSaveButtonActive(true);
  //   setTimeout(() => {
  //     setFieldMappingRuleCopied('');
  //   }, 1500);
  };

  const saveQuestion = () => {
    const requestParams = makeRequestParams({
      questionId: question ? question.id : '-1',
      questionnaireId: questionnaire ? questionnaire.id : 'Need to navigate from earlier page where q is put in AppContext',   // hack
    }, {
      answerType: radioValue,
      // fieldMappingRule: fieldMappingRuleFldRef.current.checked,
      questionInstructions: questionInstructionsFldRef.current.value,
      questionText: questionTextFldRef.current.value,
      requireAnswer: (requireAnswerFldRef.current.value === 'on'),
      statusActive: (statusActiveFldRef.current.value === 'on'),
    });
    mutate(requestParams);
    console.log('saveQuestionnaire requestParams:', requestParams);
    setSaveButtonActive(false);
  };

  const updateSaveButton = () => {
    if (questionTextFldRef.current.value && questionTextFldRef.current.value.length &&
      questionInstructionsFldRef.current.value && questionInstructionsFldRef.current.value.length &&
      questionInstructionsFldRef.current.value && questionInstructionsFldRef.current.value.length) {
      if (!saveButtonActive) {
        setSaveButtonActive(true);
      }
    }
  };

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    if (!saveButtonActive) {
      setSaveButtonActive(true);
    }
  };

  return (
    <EditQuestionFormWrapper>
      <FormControl classes={{ root: classes.formControl }}>
        <TextField
          autoFocus
          defaultValue={questionTextValue}
          id="questionTextToBeSaved"
          inputRef={questionTextFldRef}
          label="Question"
          margin="dense"
          multiline
          name="questionText"
          onChange={() => updateSaveButton()}
          placeholder="Question you are asking"
          rows={6}
          variant="outlined"
        />
        <TextField
          defaultValue={questionInstructionsValue}
          id="questionInstructionsToBeSaved"
          inputRef={questionInstructionsFldRef}
          label="Special Instructions"
          margin="dense"
          multiline
          name="questionInstructions"
          onChange={() => updateSaveButton()}
          placeholder="Instructions to clarify the question"
          rows={4}
          variant="outlined"
        />
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">Data format of answer</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="STRING"
            inputRef={formatRadioFldRef}
            name="radio-buttons-group"
            onChange={handleRadioChange}
            row
            sx={{ paddingBottom: '20px' }}
          >
            <FormControlLabel value="STRING" control={<Radio />} label="String" />
            <FormControlLabel value="BOOLEAN" control={<Radio />} label="Boolean" />
            <FormControlLabel value="INTEGER" control={<Radio />} label="Integer" />
          </RadioGroup>
        </FormControl>
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              checked={Boolean(requireAnswerValue)}
              className={classes.checkboxRoot}
              color="primary"
              id="requireAnswerToBeSaved"
              inputRef={requireAnswerFldRef}
              name="requireAnswer"
              onChange={() => updateSaveButton()}
            />
          )}
          label="Require an answer to this question"
        />
        <CheckboxLabel
          classes={{ label: classes.checkboxLabel }}
          control={(
            <Checkbox
              id="statusActiveToBeSaved"
              inputRef={statusActiveFldRef}
              checked={Boolean(statusActiveValue)}
              className={classes.checkboxRoot}
              color="primary"
              name="statusActive"
              onChange={() => updateSaveButton()}
            />
          )}
          label="Question is active"
        />
        <ShowMappingOptions>
          <div>
            {showFieldMappingOptions ? (
              <SpanWithLinkStyle onClick={() => setShowFieldMappingOptions(false)}>hide field mapping options</SpanWithLinkStyle>
            ) : (
              <SpanWithLinkStyle onClick={() => setShowFieldMappingOptions(true)}>show field mapping options</SpanWithLinkStyle>
            )}
          </div>
        </ShowMappingOptions>
        {showFieldMappingOptions && (
          <TextField
            id="fieldMappingRuleToBeSaved"
            inputRef={fieldMappingRuleFldRef}
            label="Save answer to this database field"
            name="fieldMappingRule"
            margin="dense"
            variant="outlined"
            placeholder="ex/ Person.firstName"
            value={fieldMappingRuleValue}
            onChange={() => updateSaveButton()}
          />
        )}
        {showFieldMappingOptions && (
          <FieldMappingOptions>
            {PERSON_FIELDS_ACCEPTED.map((fieldName) => (
              <OneFieldMappingOption key={`option-${fieldName}`}>
                <CopyToClipboard text={`Person.${fieldName}`} onCopy={() => copyFieldMappingRule(`Person.${fieldName}`)}>
                  <OneFieldMappingOption>
                    Person.
                    {fieldName}
                    <ContentCopyStyled />
                  </OneFieldMappingOption>
                </CopyToClipboard>
                {fieldMappingRuleCopied === `Person.${fieldName}` && <>&nbsp;Copied!</>}
              </OneFieldMappingOption>
            ))}
          </FieldMappingOptions>
        )}
        <Button
          classes={{ root: classes.saveQuestionButton }}
          color="primary"
          disabled={!saveButtonActive}
          variant="contained"
          onClick={saveQuestion}
        >
          Save Question
        </Button>
      </FormControl>
    </EditQuestionFormWrapper>
  );
};
EditQuestionForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  checkboxRoot: {
    paddingTop: 0,
    paddingLeft: '9px',
    paddingBottom: 0,
  },
  checkboxLabel: {
    marginTop: 2,
  },
  formControl: {
    width: '100%',
  },
  saveQuestionButton: {
    width: 300,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

const ShowMappingOptions = styled('div')`
  margin-bottom: 10px;
  margin-top: 5px;
`;

const CheckboxLabel = styled(FormControlLabel)`
  margin-bottom: 0 !important;
`;

const ContentCopyStyled = styled(ContentCopy)`
  color: ${DesignTokenColors.neutral300};
  height: 16px;
  margin-left: 4px;
  width: 16px;
`;

const EditQuestionFormWrapper = styled('div')`
`;

const FieldMappingOptions = styled('div')`
  margin-bottom: 16px;
`;

const OneFieldMappingOption = styled('div')`
  align-items: center;
  color: ${DesignTokenColors.neutral300};
  display: flex;
`;

export default withStyles(styles)(EditQuestionForm);
