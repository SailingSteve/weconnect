import { Button, Dialog, Modal, OutlinedInput } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { isIPhone4in } from '../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../common/utils/isCordovaOrWebApp';
import { renderLog } from '../common/utils/logging';
import { useConnectAppContext } from '../contexts/ConnectAppContext';
import { useGetAuthMutation } from '../react-query/mutations';
import weConnectQueryFn, { METHOD } from '../react-query/WeConnectQuery';

const VerifySecretCodeModal = ({ classes, person, openVerifyModalDialog }) => {
  renderLog('VerifySecretCodeModal');
  const { mutate: mutateAuth } = useGetAuthMutation();
  const { getAppContextValue } = useConnectAppContext();

  const d1FldRef = useRef('');
  const d2FldRef = useRef('');
  const d3FldRef = useRef('');
  const d4FldRef = useRef('');
  const d5FldRef = useRef('');
  const d6FldRef = useRef('');
  const buttonRef = useRef();

  const [nextFocus, setNextFocus] = useState(1);
  const [condensed] = useState(true);
  const [voterPhoneNumber] = useState(undefined);
  const [voterEmailAddress] = useState(true);
  const [openDialog, setOpenDialog] = useState(true);

  const digits = [[1, 'd1Id', d1FldRef], [2, 'd2Id', d2FldRef], [3, 'd3Id', d3FldRef], [4, 'd4Id', d4FldRef], [5, 'd5Id', d5FldRef], [6, 'd6Id', d6FldRef]];

  useEffect(() => {
    setOpenDialog(openVerifyModalDialog);
  }, [openVerifyModalDialog]);

  const handleClose = () => {
    console.log('handleClose pressed');
    setOpenDialog(false);
  };

  const voterVerifySecretCode = async () => {
    console.log('voterVerifySecretCode pressed');
    let code = '';
    for (let i = 0; i < digits.length; i++) {
      const digit = digits[i];
      const refDigit = digit[2];
      code += refDigit.current.value.toString();
    }

    const newPersonId = getAppContextValue('authenticatedPersonId');
    const data = await weConnectQueryFn('verify-email-code', { personId: newPersonId, code }, METHOD.POST);
    console.log(`/verify-email-code response: data: ${JSON.stringify(data)}`);
    await mutateAuth();  // to propagate the invalidation to HeaderBar and Login (might be a better way to do this)
    setOpenDialog(false);
  };

  useEffect(() => {
    while (d1FldRef?.current) {
      setTimeout(() => {
        // See https://github.com/mui/material-ui/issues/33004#issuecomment-1455260156
        d1FldRef.current?.focus();
      }, 50);
    }
  }, []);

  useEffect(() => {
    if (nextFocus <= 6) {
      // eslint-disable-next-line no-unused-vars
      const [index, id, refNext] = digits.find((dig) => dig[0] === nextFocus);
      if (refNext && refNext.current) {
        setTimeout(() => {
          // See https://github.com/mui/material-ui/issues/33004#issuecomment-1455260156
          refNext.current.focus();
        }, 50);
      }
    }
  }, [nextFocus]);

  const onPaste = (event) => {
    // console.log(ev.clipboardData.getData('Text'));
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text').trim();
    console.log(pastedData);

    for (let i = 0; i < pastedData.length; i++) {
      const digit = digits[i];
      const refDigit = digit[2];
      refDigit.current.value = pastedData[i];
    }

    if (pastedData.length === 6) {
      buttonRef.current.focus();
    }
  };



  const onDigitChange = (event) => {
    // eslint-disable-next-line no-unused-vars
    const [index, id, refThis] = digits.find((dig) => dig[1] === event.target.id);
    const ch = refThis.current.value[0];
    if (ch && Number.isNaN(ch - '0')) {
      refThis.current.value = '';
    } else {
      refThis.current.blur();
      setNextFocus(index + 1);
    }

    console.log(event);
  };

  if (!(openDialog)) {
    return null;
  }

  return (
    <Modal
      open={openDialog}
      // onClose={handleClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Dialog
        id="codeVerificationDialog"
        open={openDialog}
        // onClose={handleClose}
        className="u-z-index-9030"
        classes={{
          paper: clsx(classes.dialogPaper, {
            [classes.codeVerifyCordova]: isCordova(),
          }),
          root: classes.dialogRoot,
        }}
      >
        <ModalTitleArea $condensed={condensed}>
          <Button onClick={handleClose} id="emailVerificationBackButton">
            [X]
          </Button>
        </ModalTitleArea>
        <ModalContent $condensed={condensed} style={{ padding: `${isWebApp() ? 'undefined' : '37px 0 2px 0'}` }}>
          <TextContainer>
            <Title $condensed={condensed}>Code Verification</Title>
            <Subtitle>A 6-digit code has been sent to</Subtitle>
            <PhoneSubtitle>{person?.email}</PhoneSubtitle>

            {(voterEmailAddress) ? (
              <Subtitle>If you haven&apos;t received the code in 30 seconds, please check your spam folder and mark the email as &apos;Not Spam&apos;.</Subtitle>
            ) : (
              <>
                {(voterPhoneNumber) && (
                  <Subtitle>If you haven&apos;t received the code within 30 seconds, please verify the number you entered.</Subtitle>
                )}
              </>
            )}
            <InputContainer>
              {digits.map((dig) => (
                <OutlinedInput
                  classes={{ root: classes.inputBase, input: classes.input }}
                  id={dig[1]}
                  inputProps={{ maxLength: 1 }}
                  inputRef={dig[2]}
                  key={dig[1]}
                  label={false}
                  notched={false}
                  onChange={onDigitChange}
                  type="tel"
                  autoFocus={dig[0] === 0}
                  // onFocus="this.select()"
                  // maxLength={1}
                  // value={this.state.digit1}
                  // onBlur={this.handleBlur}
                  onPaste={onPaste}
                />
              ))}
            </InputContainer>
          </TextContainer>
          <ButtonsContainer $condensed={condensed}>
            <Button
              classes={{ root: classes.verifyButton }}
              id="emailVerifyButton"
              color="primary"
              ref={buttonRef}
              // disabled={this.state.digit1 === '' || this.state.digit2 === '' || this.state.digit3 === '' || this.state.digit4 === '' || this.state.digit5 === '' || this.state.digit6 === '' || voterMustRequestNewCode || voterSecretCodeRequestsLocked || voterVerifySecretCodeSubmitted}
              fullWidth
              onClick={voterVerifySecretCode}
              variant="contained"
            >
              Verify
              {/* {voterVerifySecretCodeSubmitted ? 'Verifying...' : 'Verify'} */}
            </Button>
          </ButtonsContainer>
        </ModalContent>
      </Dialog>
    </Modal>
  );
};
VerifySecretCodeModal.propTypes = {
  classes: PropTypes.object,
  person: PropTypes.object,
  openVerifyModalDialog: PropTypes.bool,
};

const styles = (theme) => ({
  dialogPaper: {
    marginTop: 48, // hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.up('sm')]: {
      maxWidth: '720px',
      width: '85%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  dialogRoot: {
    zIndex: '9030 !important',
  },
  codeVerifyCordova: {
    // top: '9%', Removed 12/13/23 to reduce vertical vibration on digit entry field advance
    bottom: 'unset',
    height: 'unset',
    minHeight: 'unset',
    margin: '5px',
  },
  inputBase: {
    alignContent: 'center',
    display: 'flex',
    // flex: '0 0 1',
    justifyContent: 'center',
    margin: '0 4px',
    // maintain aspect ratio
    width: '10vw',
    height: '10vw',
    maxWidth: 53,
    maxHeight: 53,
    fontSize: 22,
    '@media(min-width: 569px)': {
      margin: '0 8px',
      fontSize: 35,
    },
    '&:first-child': {
      marginLeft: 0,
    },
    '&:last-child': {
      marginRight: 0,
    },
    background: '#f7f7f7',
  },
  input: {
    textAlign: 'center',
    padding: '8px 0',

  },
  button: {
    width: '100%',
    border: '1px solid #ddd',
    fontWeight: 'bold',
    margin: '6px 0',
  },
  verifyButton: {
    textAlign: 'center',
    margin: '25px 0',
    width: 200,
  },
});

const InputContainer = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 100%;
  margin-top: ${condensed ? '16px' : '32px'};
`));

const ModalTitleArea = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  width: 100%;
  padding: ${condensed ? '8px' : '12px'};
  box-shadow: 0 20px 40px -25px #999;
  z-index: 999;
  display: flex;
  justify-content: flex-start;
  position: absolute;
  top: 0;
`));

const ModalContent = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  display: flex;
  flex-direction: column;
  align-items: ${condensed ? 'flex-start' : 'space-evenly'};
  height: ${isWebApp() ?  '100%' : 'unset'};
  width: 80%;
  max-width: 400px;
  margin: 0 auto;
  padding: ${condensed ? '66px 0 0 0' : '86px 0 72px 0'};
`));

const TextContainer = styled('div')`
`;

const ButtonsContainer = styled('div', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  margin-top: ${condensed ? '32px' : 'auto'};
  display: flex;
  display: flex;
  justify-content: center;
  width: 100%
`));

const Title = styled('h3', {
  shouldForwardProp: (prop) => !['condensed'].includes(prop),
})(({ condensed }) => (`
  font-weight: bold;
  font-size: ${() => (isIPhone4in() ? '26px' : '30px')};
  padding: 0 10px;
  margin-bottom: ${condensed ? '16px' : '36px'};
  color: black;
  text-align: center;
  @media(min-width: 569px) {
    font-size: 36px;
  }
`));

const Subtitle = styled('h4')`
  color: #424242;
  text-align: center;
`;

const PhoneSubtitle = styled('h4')`
  color: black;
  font-weight: bold;
  text-align: center;
`;

// const ErrorMessage = styled('div')`
//   color: red;
//   margin: 12px 0;
//   text-align: center;
//   font-size: 14px;
// `;


export default withTheme(withStyles(styles)(VerifySecretCodeModal));
