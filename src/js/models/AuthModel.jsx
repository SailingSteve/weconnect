// AuthModel.js
// Functions related to getting data from the apiDataCache, which stores data
// received from our API servers.
import isEqual from 'lodash-es/isEqual';


export const viewerCanSeeOrDo = (accessRightName, viewerAccessRights) => {
  if (!viewerAccessRights || !(accessRightName in viewerAccessRights)) {
    return false;
  }
  return viewerAccessRights[accessRightName] || false;
};

export function captureAccessRightsData (data = {}, isSuccess = false, apiDataCache = {}, dispatch) {
  const viewerAccessRights = apiDataCache.viewerAccessRights || {};
  let changeResults = {
    viewerAccessRights,
    viewerAccessRightsChanged: false,
  };
  let viewerAccessRightsNew = { ...viewerAccessRights };
  // console.log('captureAccessRightsData data:', data);
  if (data && data.accessRights && isSuccess === true) {
    let newDataReceived = false;
    const { accessRights } = data;
    if (accessRights && !('canAddPerson' in accessRights)) {
      viewerAccessRightsNew = accessRights;
      newDataReceived = true;
    } else if (!isEqual(accessRights, viewerAccessRightsNew)) {
      viewerAccessRightsNew = accessRights;
      newDataReceived = true;
    }
    if (newDataReceived) {
      // console.log('=== captureAccessRightsData viewerAccessRightsNew:', viewerAccessRightsNew, ', newDataReceived:', newDataReceived);
      dispatch({ type: 'updateByKeyValue', key: 'viewerAccessRights', value: viewerAccessRightsNew });
      changeResults = {
        viewerAccessRights: viewerAccessRightsNew,
        viewerAccessRightsChanged: true,
      };
    }
  }
  return changeResults;
}
