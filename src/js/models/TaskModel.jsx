import isEqual from 'lodash-es/isEqual';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import weConnectQueryFn from '../react-query/WeConnectQuery';
// import { useConnectAppContext } from '../contexts/ConnectAppContext';

export function getInitialGlobalTaskVariables () {
  return {
    allTaskGroupsCache: {}, // This is a dictionary key: taskGroupId, value: TaskGroup dict
    allTaskDefinitionsCache: {}, // This is a dictionary key: taskDefinitionId, value: TaskDefinition dict
    allTaskDependenciesCache: {}, // This is a dictionary key: taskDependencyId, value: TaskDependency dict
    allTasksCache: {}, // This is a dictionary key: personId, value: another dictionary key: taskDefinitionId, value: Task dict
    mostRecentTaskDefinitionIdSaved: -1,
    mostRecentTaskDefinitionSaved: {
      taskDefinitionId: -1,
    },
    mostRecentTaskGroupIdSaved: -1,
    mostRecentTaskGroupSaved: {
      firstName: '',
      lastName: '',
      taskDefinitionId: -1,
    },
    taskDefinitionsCompletedPersonIdList: {}, // This is a dictionary key: taskDefinitionId, value: list of personIds who have completed the TaskDefinition
    taskGroupCompletedByPersonList: {}, // This is a dictionary key: taskGroupId, value: list of personIds who have completed the TaskGroup
    searchResults: [],
  };
}

// This is called after making this fetchData request:
// const taskStatusListRetrieveResults = useFetchData(['task-definition-list-retrieve'], {});
export function captureTaskDefinitionListRetrieveData (
  incomingRetrieveResults = {},
  apiDataCache = {},
  dispatch,
) {
  const { data, isSuccess } = incomingRetrieveResults;
  const allTaskDefinitionsCache = apiDataCache.allTaskDefinitionsCache || {};
  const changeResults = {
    allTaskDefinitionsCache,
    allTaskDefinitionsCacheChanged: false,
  };
  const allTaskDefinitionsCacheNew = { ...allTaskDefinitionsCache };
  let newTaskDefinitionListDataReceived = false;
  if (data && data.taskDefinitionList && isSuccess === true) {
    data.taskDefinitionList.forEach((taskDefinition) => {
      if (taskDefinition && taskDefinition.taskDefinitionId && taskDefinition.taskDefinitionId >= 0) {
        if (!allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId]) {
          allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId] = taskDefinition;
          newTaskDefinitionListDataReceived = true;
        } else if (!isEqual(taskDefinition, allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId])) {
          allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId] = taskDefinition;
          newTaskDefinitionListDataReceived = true;
        }
      }
    });
  }
  if (newTaskDefinitionListDataReceived) {
    // console.log('TaskStatusListRetrieve setting allTaskDefinitionsCacheNew:', allTaskDefinitionsCacheNew);
    dispatch({ type: 'updateByKeyValue', key: 'allTaskDefinitionsCache', value: allTaskDefinitionsCacheNew });
    changeResults.allTaskDefinitionsCache = allTaskDefinitionsCacheNew;
    changeResults.allTaskDefinitionsCacheChanged = true;
  }
  return changeResults;
}

// This is called after making this fetchData request:
// const taskStatusListRetrieveResults = useFetchData(['task-group-list-retrieve'], {});
export function captureTaskGroupListRetrieveData (
  incomingRetrieveResults = {},
  apiDataCache = {},
  dispatch,
) {
  const { data, isSuccess } = incomingRetrieveResults;
  const allTaskGroupsCache = apiDataCache.allTaskGroupsCache || {};
  const changeResults = {
    allTaskGroupsCache,
    allTaskGroupsCacheChanged: false,
  };
  const allTaskGroupsCacheNew = { ...allTaskGroupsCache };
  let newTaskGroupListDataReceived = false;
  if (data && data.taskGroupList && isSuccess === true) {
    data.taskGroupList.forEach((taskGroup) => {
      if (taskGroup && taskGroup.taskGroupId && taskGroup.taskGroupId >= 0) {
        if (!allTaskGroupsCacheNew[taskGroup.taskGroupId]) {
          allTaskGroupsCacheNew[taskGroup.taskGroupId] = taskGroup;
          newTaskGroupListDataReceived = true;
        } else if (!isEqual(taskGroup, allTaskGroupsCacheNew[taskGroup.taskGroupId])) {
          allTaskGroupsCacheNew[taskGroup.taskGroupId] = taskGroup;
          newTaskGroupListDataReceived = true;
        }
      }
    });
  }
  if (newTaskGroupListDataReceived) {
    // console.log('TaskStatusListRetrieve setting allTaskGroupsCacheNew:', allTaskGroupsCacheNew);
    dispatch({ type: 'updateByKeyValue', key: 'allTaskGroupsCache', value: allTaskGroupsCacheNew });
    changeResults.allTaskGroupsCache = allTaskGroupsCacheNew;
    changeResults.allTaskGroupsCacheChanged = true;
  }
  return changeResults;
}

// This is called after making this fetchData request:
// const taskStatusListRetrieveResults = useFetchData(['task-status-list-retrieve'], { personIdList: personIdsList });
// TODO: Dale still thinking about this. Please leave this commented out code until April 2025
export function captureTaskStatusListRetrieveData (
  incomingRetrieveResults = {},
  apiDataCache = {},
  dispatch,
) {
  const { data, isSuccess } = incomingRetrieveResults;
  // const allTaskDefinitionsCache = apiDataCache.allTaskDefinitionsCache || {};
  // const allTaskDependenciesCache = apiDataCache.allTaskDependenciesCache || {};
  // const allTaskGroupsCache = apiDataCache.allTaskGroupsCache || {};
  const allTasksCache = apiDataCache.allTasksCache || {};
  const changeResults = {
    // allTaskDefinitionsCache,
    // allTaskDefinitionsCacheChanged: false,
    // allTaskDependenciesCache,
    // allTaskDependenciesCacheChanged: false,
    // allTaskGroupsCache,
    // allTaskGroupsCacheChanged: false,
    allTasksCache,
    allTasksCacheChanged: false,
  };
  // const allTaskDefinitionsCacheNew = { ...allTaskDefinitionsCache };
  // const allTaskDependenciesCacheNew = { ...allTaskDependenciesCache };
  // const allTaskGroupsCacheNew = { ...allTaskGroupsCache };
  const allTasksCacheNew = { ...allTasksCache };
  // let newTaskDefinitionListDataReceived = false;
  // if (data && data.taskDefinitionList && isSuccess === true) {
  //   data.taskDefinitionList.forEach((taskDefinition) => {
  //     if (taskDefinition && taskDefinition.taskDefinitionId && taskDefinition.taskDefinitionId >= 0) {
  //       if (!allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId]) {
  //         allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId] = taskDefinition;
  //         newTaskDefinitionListDataReceived = true;
  //       } else if (!isEqual(taskDefinition, allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId])) {
  //         allTaskDefinitionsCacheNew[taskDefinition.taskDefinitionId] = taskDefinition;
  //         newTaskDefinitionListDataReceived = true;
  //       }
  //     }
  //   });
  // }
  // let newTaskDependenciesListDataReceived = false;
  // TODO TaskDependencies API processing when data available
  // let newTaskGroupListDataReceived = false;
  // if (data && data.taskGroupList && isSuccess === true) {
  //   data.taskGroupList.forEach((taskGroup) => {
  //     if (taskGroup && taskGroup.taskGroupId && taskGroup.taskGroupId >= 0) {
  //       if (!allTaskGroupsCacheNew[taskGroup.taskGroupId]) {
  //         allTaskGroupsCacheNew[taskGroup.taskGroupId] = taskGroup;
  //         newTaskGroupListDataReceived = true;
  //       } else if (!isEqual(taskGroup, allTaskGroupsCacheNew[taskGroup.taskGroupId])) {
  //         allTaskGroupsCacheNew[taskGroup.taskGroupId] = taskGroup;
  //         newTaskGroupListDataReceived = true;
  //       }
  //     }
  //   });
  // }
  let newTaskListDataReceived = false;
  if (data && data.taskList && isSuccess === true) {
    data.taskList.forEach((task) => {
      if (task && task.personId && task.personId >= 0 && task.taskDefinitionId && task.taskDefinitionId >= 0) {
        if (!allTasksCacheNew[task.personId]) {
          allTasksCacheNew[task.personId] = {};
        }
        if (!allTasksCacheNew[task.personId][task.taskDefinitionId]) {
          allTasksCacheNew[task.personId][task.taskDefinitionId] = task;
          newTaskListDataReceived = true;
        } else if (!isEqual(task, allTasksCacheNew[task.personId][task.taskDefinitionId])) {
          allTasksCacheNew[task.personId][task.taskDefinitionId] = task;
          newTaskListDataReceived = true;
        }
      }
    });
  }
  // if (newTaskDefinitionListDataReceived) {
  //   // console.log('TaskStatusListRetrieve setting allTaskDefinitionsCacheNew:', allTaskDefinitionsCacheNew);
  //   dispatch({ type: 'updateByKeyValue', key: 'allTaskDefinitionsCache', value: allTaskDefinitionsCacheNew });
  //   changeResults.allTaskDefinitionsCache = allTaskDefinitionsCacheNew;
  //   changeResults.allTaskDefinitionsCacheChanged = true;
  // }
  // if (newTaskDependenciesListDataReceived) {
  //   // console.log('TaskStatusListRetrieve setting allTaskDependenciesCacheNew:', allTaskDependenciesCacheNew);
  //   dispatch({ type: 'updateByKeyValue', key: 'allTaskDependenciesCache', value: allTaskDependenciesCacheNew });
  //   changeResults.allTaskDependenciesCache = allTaskDependenciesCacheNew;
  //   changeResults.allTaskDependenciesCacheChanged = true;
  // }
  if (newTaskListDataReceived) {
    // console.log('TaskStatusListRetrieve setting allTasksCacheNew:', allTasksCacheNew);
    dispatch({ type: 'updateByKeyValue', key: 'allTasksCache', value: allTasksCacheNew });
    changeResults.allTasksCache = allTasksCacheNew;
    changeResults.allTasksCacheChanged = true;
  }
  // if (newTaskGroupListDataReceived) {
  //   // console.log('TaskStatusListRetrieve setting allTaskGroupsCacheNew:', allTaskGroupsCacheNew);
  //   dispatch({ type: 'updateByKeyValue', key: 'allTaskGroupsCache', value: allTaskGroupsCacheNew });
  //   changeResults.allTaskGroupsCache = allTaskGroupsCacheNew;
  //   changeResults.allTaskGroupsCacheChanged = true;
  // }
  return changeResults;
}

// TODO Update to task-definition-save
// export function TaskDefinitionSave () {
//   // Transferred from react-query/mutation.jsx to test a new approach
//   const { getAppContextValue, setAppContextValue } = useConnectAppContext();
//   const queryClient = useQueryClient();
//
//   // We want to add to onSuccess below a function that stores in the Context the person data which was stored on the API server
//   return useMutation({
//     mutationFn: (params) => weConnectQueryFn('person-save', params),
//     onError: (error) => console.log('error in personSaveMutation: ', error),
//     onSuccess: (results) => {
//       // Update the cached people with the new/changed person data, stored in allPeopleCache
//       // console.log('person-save onSuccess true, results: ', results);
//       const allPeopleCache = getAppContextValue('allPeopleCache');
//       if (results.personId >= 0) {
//         allPeopleCache[results.personId] = results;
//         setAppContextValue('allPeopleCache', allPeopleCache);
//       }
//       // And now invalidate other queries that pulled in this data
//       queryClient.invalidateQueries('person-list-retrieve');
//       queryClient.invalidateQueries('team-list-retrieve');
//     },
//   });
// }
