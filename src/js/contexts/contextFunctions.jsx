
export const clearSignedInGlobals = (setAppContextValue) => {
  setAppContextValue('authenticatedPerson', undefined);
  setAppContextValue('authenticatedPersonId', -1);
  setAppContextValue('isAuthenticated', false);
  // setAppContextValue('loggedInPersonIsAdmin', false);
  setAppContextValue('personIsSignedIn', false);
};
