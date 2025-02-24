// PersonController.js
// Functions for manipulating data related to the person table.
import { PERSON_AWAY_REASONS } from '../models/PersonModel';
import webAppConfig from '../config';

export const getPersonAwayReason = (personAway) => {
  let personAwayReasonFound = 'isVacation'; // Default to vacation if none of the other reasons are found
  PERSON_AWAY_REASONS.forEach((personAwayReason) => {
    if (personAway[personAwayReason] === true) {
      personAwayReasonFound = personAwayReason;
    }
  });
  return personAwayReasonFound;
};

export const getPersonAwayParamsToSave = (incomingPersonAwayReason) => {
  const paramsToReturn = {};
  PERSON_AWAY_REASONS.forEach((personAwayReason) => {
    paramsToReturn[personAwayReason] = personAwayReason === incomingPersonAwayReason;
  });
  return paramsToReturn;
};

export const getPersonAwayLabel = (personAwayReason) => {
  switch (personAwayReason) {
    case 'isLeaveOfAbsence':
      return 'Leave of Absence';
    case 'isMedicalLeave':
      return 'Medical Leave';
    case 'isNonResponsive':
      return 'Has stopped responding to management contact';
    case 'isNotAttending':
      return 'Around, but cannot attend meetings';
    case 'isResigned':
      if (webAppConfig.ORGANIZATION_NAME) {
        return `Resigning from ${webAppConfig.ORGANIZATION_NAME}`;
      } else {
        return 'Resigned';
      }
    case 'isVacation':
      return 'Vacation';
    case 'isWorkTrip':
      return 'Work Trip';
    default:
      return personAwayReason;
  }
};

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
