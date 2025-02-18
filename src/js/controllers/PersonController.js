// PersonController.js
// Functions for manipulating data related to the person table.

export const searchWordFoundInOnePerson = (searchWord, person) => {
  const fieldsToSearch = [
    'birthdayMonthAndDay', 'bluesky', 'facebookUrl', 'githubUrl',
    'linkedInUrl', 'portfolioUrl', 'snapchat', 'twitch', 'twitterHandle',
    'websiteUrl', 'emailOfficial', 'emailPersonal',
    'firstName', 'firstNamePreferred', 'jobTitle', 'lastName',
    'location', 'stateCode', 'zipCode',
  ];
  let found = false;

  const normalizedSearchWord = searchWord.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  fieldsToSearch.forEach((fieldValue) => {
    const personFieldValue = person[fieldValue];
    if (personFieldValue) {
      const normalizedPersonFieldValue = personFieldValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normalizedPersonFieldValue.includes(normalizedSearchWord)) {
        found = true;
      }
    }
  });
  return found;
};

export const isSearchTextFoundInPerson = (incomingSearchText, person) => {
  if (!person || person.personId < 0) return false; // Invalid person or personId
  if (!incomingSearchText || (incomingSearchText && incomingSearchText.length === 0)) return true; // No searchText provided
  const searchWords = incomingSearchText.split(' ');
  let atLeastOneSearchWordFound = false;
  let allSearchWordsFound = true;
  let searchWordFound = false;
  searchWords.forEach((searchWord) => {
    searchWordFound = searchWordFoundInOnePerson(searchWord, person);
    if (searchWordFound) {
      atLeastOneSearchWordFound = true;
    }
    if (!searchWordFound) {
      allSearchWordsFound = false;
    }
  });
  return atLeastOneSearchWordFound && allSearchWordsFound;
};
