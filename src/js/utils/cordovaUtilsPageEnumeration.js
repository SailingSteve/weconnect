import { normalizedHref } from '../common/utils/hrefUtils';
import stringContains from '../common/utils/stringContains';
import CordovaPageConstants from '../constants/CordovaPageConstants';

// eslint-disable-next-line import/prefer-default-export
export function pageEnumeration () {
  // const showBallotDecisionTabs = (BallotStore.ballotLength !== BallotStore.ballotRemainingChoicesLength) && (BallotStore.ballotRemainingChoicesLength > 0);

  const path = normalizedHref();

  // second level paths must be tried first
  if (path.startsWith('/ballot/vote')) {
    return CordovaPageConstants.ballotVote;
  } else if (path.startsWith('/more/about')) {
    return CordovaPageConstants.moreAbout;
  } else if (path.startsWith('/credits') ||
             path.startsWith('/more/credits')) {
    return CordovaPageConstants.moreCredits;
  } else if (path.startsWith('/more/elections')) {
    return CordovaPageConstants.moreElections;
  } else if (path.startsWith('/more/attributions') ||
             path.startsWith('/more/donate') ||
             path.startsWith('/more/privacy') ||
             path.startsWith('/more/terms')) {
    return CordovaPageConstants.moreTerms;
  } else if (path.startsWith('/more/faq') ||
             path.startsWith('/more/howwevotehelps')) {
    return CordovaPageConstants.moreFaq;
  // } else if (path.startsWith('/voterguide/')) {
  //   return CordovaPageConstants.voterGuideCreatorWild;
  } else if (path.startsWith('/settings/account')) {
    return CordovaPageConstants.settingsAccount;
  } else if (path.startsWith('/settings/hamburger')) {
    return CordovaPageConstants.settingsHamburger;
  } else if (path.startsWith('/settings/tools')) {
    return CordovaPageConstants.moreTools;
  } else if (path.startsWith('/settings/notifications')) {
    return CordovaPageConstants.settingsNotifications;
  } else if (path.startsWith('/settings/profile') || path.startsWith('/settings/yourdata')) {
    return CordovaPageConstants.settingsProfile;
  } else if (path.startsWith('/settings/share')) {
    return CordovaPageConstants.settingsShare;
  } else if (path.startsWith('/settings/subscription')) {
    return CordovaPageConstants.settingsSubscription;
  } else if (path.startsWith('/settings/voterguidelist')) {
    return CordovaPageConstants.settingsVoterGuideLst;
  } else if (path.startsWith('/values/list')) {
    return CordovaPageConstants.valuesList;
  } else if (path.startsWith('/office/')) {
    return CordovaPageConstants.officeWild;
  } else if (path.startsWith('/settings/') || path.includes('facebook_sign_in')) {
    return CordovaPageConstants.settingsWild;
  } else if (path.startsWith('/value/')) {
    return CordovaPageConstants.valuesWild;
  } else if (path.startsWith('/vg/')) {
    return CordovaPageConstants.voterGuideCreatorWild;
  } else if (stringContains('/voterguide/') && (
    path.includes('btcand') || path.includes('btmeas') || path.includes('/btdb'))) {
    return CordovaPageConstants.voterGuideWild;
  } else if (path.startsWith('/-') || // Shared item
    path.startsWith('/wevoteintro/')) {
    return CordovaPageConstants.wevoteintroWild;
  } else if (path.startsWith('/measure/')) {
    return CordovaPageConstants.measureWild;
  } else if (path.includes('/showpublicfiguresfilter') ||  // /opinions/f/showPublicFiguresFilter
             path.includes('/showorganizationsfilter')) {  // /opinions/f/showOrganizationsFilter
    return CordovaPageConstants.opinionsFiltered;

  // then specific first level paths
  } else if (path.startsWith('/c/') || path.startsWith('/id/')) {  // /candidate/ == one candidate vs. /cs/ == candidates by state
    // Campaign pages
    return CordovaPageConstants.values;
  } else if (path.endsWith('/cs/') || path.includes('/start-a-campaign')) {  // /candidate/ == one candidate vs. /cs/ == candidates by state
    return CordovaPageConstants.values; // Use /value setting
  } else if (path.startsWith('/friends/current') || path.startsWith('/friends/all')) {
    return CordovaPageConstants.friendsCurrent;
  } else if (path.startsWith('/friends/sent-requests') || path.startsWith('/friends/requests')) {
    return CordovaPageConstants.friendsSentRequest;
  } else if (path.startsWith('/findfriends') ||
             path.startsWith('/setupaccount') ||
             path.startsWith('/unsubscribe')) {
    return CordovaPageConstants.start;
  } else if (path.startsWith('/welcomehome') ||
             path.startsWith('/for-organizations') ||
             path.startsWith('/for-campaigns') ||
             path.startsWith('/more/pricing')) {
    return CordovaPageConstants.welcomeWild;
  } else if (path.startsWith('/twitter_sign_in')) {
    return CordovaPageConstants.twitterSignIn;
  } else if (path.startsWith('/m/followers') || path.startsWith('/m/friends') || path.startsWith('/m/following')) {
    return CordovaPageConstants.twitterIdMFollowers;
  } else if (path.includes('/') && (
    path.includes('btcand') || path.includes('btmeas') || path.includes('/btdb'))) {
    return CordovaPageConstants.twitterInfoPage;
  // } else if (AppObservableStore.getShowTwitterLandingPage()) {
  //   return CordovaPageConstants.twitterHandleLanding;
  }
  return CordovaPageConstants.defaultVal;
}
