// import { ReduceStore } from 'flux/utils';
// import Dispatcher from '../common/dispatcher/Dispatcher';
//
// class TaskStore extends ReduceStore {
//   getInitialState () {
//     return {
//       allTaskGroupsCache: {}, // This is a dictionary key: taskGroupId, value: TaskGroup dict
//       allTaskDefinitionsCache: {}, // This is a dictionary key: taskDefinitionId, value: TaskDefinition dict
//       allTaskDependenciesCache: {}, // This is a dictionary key: taskDependencyId, value: TaskDependency dict
//       allTasksCache: {}, // This is a dictionary key: personId, value: another dictionary key: taskDefinitionId, value: Task dict
//       mostRecentTaskDefinitionIdSaved: -1,
//       mostRecentTaskDefinitionSaved: {
//         taskDefinitionId: -1,
//       },
//       mostRecentTaskGroupIdSaved: -1,
//       mostRecentTaskGroupSaved: {
//         firstName: '',
//         lastName: '',
//         taskDefinitionId: -1,
//       },
//       taskDefinitionsCompletedPersonIdList: {}, // This is a dictionary key: taskDefinitionId, value: list of personIds who have completed the TaskDefinition
//       taskGroupCompletedByPersonList: {}, // This is a dictionary key: taskGroupId, value: list of personIds who have completed the TaskGroup
//       searchResults: [],
//     };
//   }
//
//   getAllCachedTaskDefinitionsList () {
//     const { allTaskDefinitionsCache } = this.getState();
//     const taskDefinitionListRaw = Object.values(allTaskDefinitionsCache);
//
//     const taskDefinitionList = [];
//     let taskDefinitionFiltered;
//     let taskDefinitionRaw;
//     for (let i = 0; i < taskDefinitionListRaw.length; i++) {
//       taskDefinitionRaw = taskDefinitionListRaw[i];
//       // console.log('TaskStore getAllCachedTaskDefinitionsList taskDefinition:', taskDefinition);
//       taskDefinitionFiltered = taskDefinitionRaw;
//       taskDefinitionList.push(taskDefinitionFiltered);
//     }
//     return taskDefinitionList;
//   }
//
//   getAllCachedTaskGroupList () {
//     const { allTaskGroupsCache } = this.getState();
//     const taskGroupListRaw = Object.values(allTaskGroupsCache);
//
//     const taskGroupList = [];
//     let taskGroupFiltered;
//     let taskGroupRaw;
//     for (let i = 0; i < taskGroupListRaw.length; i++) {
//       taskGroupRaw = taskGroupListRaw[i];
//       // console.log('TaskStore getAllCachedTaskDefinitionsList taskGroup:', taskGroup);
//       taskGroupFiltered = taskGroupRaw;
//       taskGroupList.push(taskGroupFiltered);
//     }
//     return taskGroupList;
//   }
//
//   getMostRecentTaskGroupChanged () {
//     // console.log('TaskStore getMostRecentTaskGroupChanged Id:', this.getState().mostRecentTaskGroupIdSaved);
//     if (this.getState().mostRecentTaskGroupIdSaved !== -1) {
//       return this.getTaskGroupById(this.getState().mostRecentTaskGroupIdSaved);
//     }
//     return {};
//   }
//
//   getMostRecentTaskGroupIdChanged () {
//     // console.log('TaskStore getMostRecentTaskGroupChanged Id:', this.getState().mostRecentTaskGroupIdSaved);
//     return this.getState().mostRecentTaskGroupIdSaved;
//   }
//
//   getTask (personId, taskDefinitionId) {
//     const { allTasksCache } = this.getState();
//     // console.log('TaskStore getTaskListDictByPersonId:', personId, ', allTasksCache:', allTasksCache);
//     return allTasksCache[personId][taskDefinitionId] || {};
//   }
//
//   getTaskDefinitionListByTaskGroupId (taskGroupId) {
//     const { allTaskDefinitionsCache } = this.getState();
//     const taskDefinitionListRaw = Object.values(allTaskDefinitionsCache);
//     const taskDefinitionListForTaskDefinition = [];
//     for (let i = 0; i < taskDefinitionListRaw.length; i++) {
//       if (taskDefinitionListRaw[i].taskGroupId === taskGroupId) {
//         taskDefinitionListForTaskDefinition.push(taskDefinitionListRaw[i]);
//       }
//     }
//     // console.log('TaskStore getTaskDefinitionById:', taskDefinitionId, ', taskDefinitionListForTaskDefinition:', taskDefinitionListForTaskDefinition);
//     return taskDefinitionListForTaskDefinition;
//   }
//
//   getTaskGroupById (taskGroupId) {
//     const { allTaskGroupsCache } = this.getState();
//     // console.log('TaskStore getTaskGroupById:', taskGroupId, ', allTaskGroupsCache:', allTaskGroupsCache);
//     return allTaskGroupsCache[taskGroupId] || {};
//   }
//
//   getTaskGroupIdByTaskDefinitionId (taskDefinitionId) {
//     const taskDefinitionDict = this.getTaskDefinitionById(taskDefinitionId);
//     return taskDefinitionDict.taskGroupId || -1;
//   }
//
//   getTaskDefinitionById (taskDefinitionId) {
//     const { allTaskDefinitionsCache } = this.getState();
//     // console.log('TaskStore getTaskDefinitionById:', taskDefinitionId, ', allTaskDefinitionsCache:', allTaskDefinitionsCache);
//     return allTaskDefinitionsCache[taskDefinitionId] || {};
//   }
//
//   getTaskListDictByPersonId (personId) {
//     const { allTasksCache } = this.getState();
//     // console.log('TaskStore getTaskListDictByPersonId:', personId, ', allTasksCache:', allTasksCache);
//     return allTasksCache[personId] || {};
//   }
//
//   getTaskListForPerson (personId) {
//     const taskDict = this.getTaskListDictByPersonId(personId);
//     const taskList = Object.values(taskDict);
//     // console.log('TaskStore getTasksCompletedByPersonList:', personId, ', taskDefinitionsCompletedPersonIdList:', taskDefinitionsCompletedPersonIdList);
//     return taskList || [];
//   }
//
//   getSearchResults () {
//     // console.log('TaskStore getSearchResults:', this.getState().searchResults);
//     return this.getState().searchResults || [];
//   }
//
//   reduce (state, action) {
//     const {
//       allTaskGroupsCache, allTaskDefinitionsCache, allTasksCache,
//     } = state;
//     let missingRequiredVariable = false;
//     let personId = -1;
//     let taskDefinitionId = -1;
//     let revisedState = state;
//     let searchResults = [];
//     let taskGroupId = -1;
//
//     switch (action.type) {
//       case 'task-definition-list-retrieve':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         // console.log('TaskStore task-definition-list-retrieve taskDefinitionList:', action.res.taskDefinitionList);
//         if (action.res.isSearching && action.res.isSearching === true) {
//           // console.log('TaskStore isSearching:', action.res.isSearching);
//           searchResults = action.res.taskDefinitionList;
//           // console.log('TaskStore searchResults:', searchResults);
//           revisedState = {
//             ...revisedState,
//             searchResults,
//           };
//         }
//         if (action.res.taskDefinitionList) {
//           action.res.taskDefinitionList.forEach((taskDefinition) => {
//             // console.log('TaskStore task-definition-list-retrieve adding taskDefinition:', taskDefinition);
//             if (taskDefinition && (taskDefinition.id >= 0)) {
//               allTaskDefinitionsCache[taskDefinition.id] = taskDefinition;
//             }
//           });
//           // console.log('allTaskDefinitionsCache:', allTaskDefinitionsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskDefinitionsCache,
//           };
//         }
//         // console.log('TaskStore revisedState:', revisedState);
//         return revisedState;
//
//       case 'task-definition-save':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         if (action.res.taskDefinitionId >= 0) {
//           taskDefinitionId = action.res.taskDefinitionId;
//         } else {
//           taskDefinitionId = -1;
//         }
//
//         if (taskDefinitionId >= 0) {
//           if (action.res.taskDefinitionCreated || action.res.taskDefinitionUpdated) {
//             // console.log('TaskStore taskDefinition-save taskDefinitionId:', taskDefinitionId);
//             allTaskDefinitionsCache[taskDefinitionId] = action.res;
//             revisedState = {
//               ...revisedState,
//               allTaskDefinitionsCache,
//               mostRecentTaskDefinitionIdSaved: taskDefinitionId,
//             };
//           } else {
//             console.log('TaskStore task-definition-save NOT updated or saved.');
//           }
//         } else {
//           console.log('TaskStore task-definition-save MISSING taskDefinitionId:', taskDefinitionId);
//         }
//         return revisedState;
//
//       case 'task-group-list-retrieve':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         // console.log('TaskStore task-group-list-retrieve taskGroupList:', action.res.taskGroupList);
//         if (action.res.isSearching && action.res.isSearching === true) {
//           // console.log('TaskStore isSearching:', action.res.isSearching);
//           searchResults = action.res.taskGroupList;
//           // console.log('TaskStore searchResults:', searchResults);
//           revisedState = {
//             ...revisedState,
//             searchResults,
//           };
//         }
//         if (action.res.taskGroupList) {
//           action.res.taskGroupList.forEach((taskGroup) => {
//             // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
//             if (taskGroup && (taskGroup.id >= 0)) {
//               allTaskGroupsCache[taskGroup.id] = taskGroup;
//             }
//           });
//           // console.log('allTaskGroupsCache:', allTaskGroupsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskGroupsCache,
//           };
//         }
//         // console.log('TaskStore revisedState:', revisedState);
//         return revisedState;
//
//       case 'task-group-save':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         if (action.res.taskGroupId >= 0) {
//           taskGroupId = action.res.taskGroupId;
//         } else {
//           taskGroupId = -1;
//         }
//
//         if (taskGroupId >= 0) {
//           // console.log('TaskStore task-group-save taskGroupId:', taskGroupId);
//           allTaskGroupsCache[taskGroupId] = action.res;
//           revisedState = {
//             ...revisedState,
//             allTaskGroupsCache,
//             mostRecentTaskGroupIdSaved: taskGroupId,
//           };
//         } else {
//           console.log('TaskStore task-group-save MISSING taskGroupId:', taskGroupId);
//         }
//         return revisedState;
//
//       case 'task-save':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         missingRequiredVariable = false;
//         revisedState = state;
//         if (action.res.personId >= 0) {
//           personId = action.res.personId;
//         } else {
//           personId = -1;
//           missingRequiredVariable = true;
//         }
//         if (action.res.taskDefinitionId >= 0) {
//           taskDefinitionId = action.res.taskDefinitionId;
//         } else {
//           taskDefinitionId = -1;
//           missingRequiredVariable = true;
//         }
//
//         if (!missingRequiredVariable) {
//           // console.log('TaskStore task-save personId:', personId, ', taskDefinitionId:', taskDefinitionId);
//           allTasksCache[personId][taskDefinitionId] = action.res;
//           revisedState = {
//             ...revisedState,
//             allTasksCache,
//           };
//         } else {
//           console.log('TaskStore task-save MISSING_REQUIRED_VARIABLE personId:', personId, ', taskDefinitionId:', taskDefinitionId);
//         }
//         return revisedState;
//
//       case 'task-status-list-retrieve':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         // console.log('TaskStore task-definition-list-retrieve taskDefinitionList:', action.res.taskDefinitionList);
//         if (action.res.taskDefinitionList) {
//           action.res.taskDefinitionList.forEach((taskDefinition) => {
//             // console.log('TaskStore task-definition-list-retrieve adding taskDefinition:', taskDefinition);
//             if (taskDefinition && (taskDefinition.id >= 0)) {
//               allTaskDefinitionsCache[taskDefinition.id] = taskDefinition;
//             }
//           });
//           // console.log('allTaskDefinitionsCache:', allTaskDefinitionsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskDefinitionsCache,
//           };
//         }
//         if (action.res.taskGroupList) {
//           action.res.taskGroupList.forEach((taskGroup) => {
//             // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
//             if (taskGroup && (taskGroup.id >= 0)) {
//               allTaskGroupsCache[taskGroup.id] = taskGroup;
//             }
//           });
//           // console.log('allTaskGroupsCache:', allTaskGroupsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskGroupsCache,
//           };
//         }
//         if (action.res.taskList) {
//           action.res.taskList.forEach((task) => {
//             // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
//             if (task && (task.personId >= 0)) {
//               if (!allTasksCache[task.personId]) {
//                 allTasksCache[task.personId] = {};
//               }
//               if (task && (task.taskDefinitionId >= 0)) {
//                 allTasksCache[task.personId][task.taskDefinitionId] = task;
//               } else {
//                 console.log('TaskStore task-group-list-retrieve skipping task with missing personId:', task);
//               }
//             } else {
//               console.log('TaskStore task-group-list-retrieve skipping task with missing taskDefinitionId:', task);
//             }
//           });
//           // console.log('allTasksCache:', allTasksCache);
//           revisedState = {
//             ...revisedState,
//             allTasksCache,
//           };
//         }
//         // console.log('TaskStore revisedState:', revisedState);
//         return revisedState;
//
//       default:
//         return state;
//     }
//   }
// }
//
// export default new TaskStore(Dispatcher);
// import { ReduceStore } from 'flux/utils';
// import Dispatcher from '../common/dispatcher/Dispatcher';
//
// class TaskStore extends ReduceStore {
//   getInitialState () {
//     return {
//       allTaskGroupsCache: {}, // This is a dictionary key: taskGroupId, value: TaskGroup dict
//       allTaskDefinitionsCache: {}, // This is a dictionary key: taskDefinitionId, value: TaskDefinition dict
//       allTaskDependenciesCache: {}, // This is a dictionary key: taskDependencyId, value: TaskDependency dict
//       allTasksCache: {}, // This is a dictionary key: personId, value: another dictionary key: taskDefinitionId, value: Task dict
//       mostRecentTaskDefinitionIdSaved: -1,
//       mostRecentTaskDefinitionSaved: {
//         taskDefinitionId: -1,
//       },
//       mostRecentTaskGroupIdSaved: -1,
//       mostRecentTaskGroupSaved: {
//         firstName: '',
//         lastName: '',
//         taskDefinitionId: -1,
//       },
//       taskDefinitionsCompletedPersonIdList: {}, // This is a dictionary key: taskDefinitionId, value: list of personIds who have completed the TaskDefinition
//       taskGroupCompletedByPersonList: {}, // This is a dictionary key: taskGroupId, value: list of personIds who have completed the TaskGroup
//       searchResults: [],
//     };
//   }
//
//   getAllCachedTaskDefinitionsList () {
//     const { allTaskDefinitionsCache } = this.getState();
//     const taskDefinitionListRaw = Object.values(allTaskDefinitionsCache);
//
//     const taskDefinitionList = [];
//     let taskDefinitionFiltered;
//     let taskDefinitionRaw;
//     for (let i = 0; i < taskDefinitionListRaw.length; i++) {
//       taskDefinitionRaw = taskDefinitionListRaw[i];
//       // console.log('TaskStore getAllCachedTaskDefinitionsList taskDefinition:', taskDefinition);
//       taskDefinitionFiltered = taskDefinitionRaw;
//       taskDefinitionList.push(taskDefinitionFiltered);
//     }
//     return taskDefinitionList;
//   }
//
//   getAllCachedTaskGroupList () {
//     const { allTaskGroupsCache } = this.getState();
//     const taskGroupListRaw = Object.values(allTaskGroupsCache);
//
//     const taskGroupList = [];
//     let taskGroupFiltered;
//     let taskGroupRaw;
//     for (let i = 0; i < taskGroupListRaw.length; i++) {
//       taskGroupRaw = taskGroupListRaw[i];
//       // console.log('TaskStore getAllCachedTaskDefinitionsList taskGroup:', taskGroup);
//       taskGroupFiltered = taskGroupRaw;
//       taskGroupList.push(taskGroupFiltered);
//     }
//     return taskGroupList;
//   }
//
//   getMostRecentTaskGroupChanged () {
//     // console.log('TaskStore getMostRecentTaskGroupChanged Id:', this.getState().mostRecentTaskGroupIdSaved);
//     if (this.getState().mostRecentTaskGroupIdSaved !== -1) {
//       return this.getTaskGroupById(this.getState().mostRecentTaskGroupIdSaved);
//     }
//     return {};
//   }
//
//   getMostRecentTaskGroupIdChanged () {
//     // console.log('TaskStore getMostRecentTaskGroupChanged Id:', this.getState().mostRecentTaskGroupIdSaved);
//     return this.getState().mostRecentTaskGroupIdSaved;
//   }
//
//   getTask (personId, taskDefinitionId) {
//     const { allTasksCache } = this.getState();
//     // console.log('TaskStore getTaskListDictByPersonId:', personId, ', allTasksCache:', allTasksCache);
//     return allTasksCache[personId][taskDefinitionId] || {};
//   }
//
//   getTaskDefinitionListByTaskGroupId (taskGroupId) {
//     const { allTaskDefinitionsCache } = this.getState();
//     const taskDefinitionListRaw = Object.values(allTaskDefinitionsCache);
//     const taskDefinitionListForTaskDefinition = [];
//     for (let i = 0; i < taskDefinitionListRaw.length; i++) {
//       if (taskDefinitionListRaw[i].taskGroupId === taskGroupId) {
//         taskDefinitionListForTaskDefinition.push(taskDefinitionListRaw[i]);
//       }
//     }
//     // console.log('TaskStore getTaskDefinitionById:', taskDefinitionId, ', taskDefinitionListForTaskDefinition:', taskDefinitionListForTaskDefinition);
//     return taskDefinitionListForTaskDefinition;
//   }
//
//   getTaskGroupById (taskGroupId) {
//     const { allTaskGroupsCache } = this.getState();
//     // console.log('TaskStore getTaskGroupById:', taskGroupId, ', allTaskGroupsCache:', allTaskGroupsCache);
//     return allTaskGroupsCache[taskGroupId] || {};
//   }
//
//   getTaskGroupIdByTaskDefinitionId (taskDefinitionId) {
//     const taskDefinitionDict = this.getTaskDefinitionById(taskDefinitionId);
//     return taskDefinitionDict.taskGroupId || -1;
//   }
//
//   getTaskDefinitionById (taskDefinitionId) {
//     const { allTaskDefinitionsCache } = this.getState();
//     // console.log('TaskStore getTaskDefinitionById:', taskDefinitionId, ', allTaskDefinitionsCache:', allTaskDefinitionsCache);
//     return allTaskDefinitionsCache[taskDefinitionId] || {};
//   }
//
//   getTaskListDictByPersonId (personId) {
//     const { allTasksCache } = this.getState();
//     // console.log('TaskStore getTaskListDictByPersonId:', personId, ', allTasksCache:', allTasksCache);
//     return allTasksCache[personId] || {};
//   }
//
//   getTaskListForPerson (personId) {
//     const taskDict = this.getTaskListDictByPersonId(personId);
//     const taskList = Object.values(taskDict);
//     // console.log('TaskStore getTasksCompletedByPersonList:', personId, ', taskDefinitionsCompletedPersonIdList:', taskDefinitionsCompletedPersonIdList);
//     return taskList || [];
//   }
//
//   getSearchResults () {
//     // console.log('TaskStore getSearchResults:', this.getState().searchResults);
//     return this.getState().searchResults || [];
//   }
//
//   reduce (state, action) {
//     const {
//       allTaskGroupsCache, allTaskDefinitionsCache, allTasksCache,
//     } = state;
//     let missingRequiredVariable = false;
//     let personId = -1;
//     let taskDefinitionId = -1;
//     let revisedState = state;
//     let searchResults = [];
//     let taskGroupId = -1;
//
//     switch (action.type) {
//       case 'task-definition-list-retrieve':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         // console.log('TaskStore task-definition-list-retrieve taskDefinitionList:', action.res.taskDefinitionList);
//         if (action.res.isSearching && action.res.isSearching === true) {
//           // console.log('TaskStore isSearching:', action.res.isSearching);
//           searchResults = action.res.taskDefinitionList;
//           // console.log('TaskStore searchResults:', searchResults);
//           revisedState = {
//             ...revisedState,
//             searchResults,
//           };
//         }
//         if (action.res.taskDefinitionList) {
//           action.res.taskDefinitionList.forEach((taskDefinition) => {
//             // console.log('TaskStore task-definition-list-retrieve adding taskDefinition:', taskDefinition);
//             if (taskDefinition && (taskDefinition.id >= 0)) {
//               allTaskDefinitionsCache[taskDefinition.id] = taskDefinition;
//             }
//           });
//           // console.log('allTaskDefinitionsCache:', allTaskDefinitionsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskDefinitionsCache,
//           };
//         }
//         // console.log('TaskStore revisedState:', revisedState);
//         return revisedState;
//
//       case 'task-definition-save':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         if (action.res.taskDefinitionId >= 0) {
//           taskDefinitionId = action.res.taskDefinitionId;
//         } else {
//           taskDefinitionId = -1;
//         }
//
//         if (taskDefinitionId >= 0) {
//           if (action.res.taskDefinitionCreated || action.res.taskDefinitionUpdated) {
//             // console.log('TaskStore taskDefinition-save taskDefinitionId:', taskDefinitionId);
//             allTaskDefinitionsCache[taskDefinitionId] = action.res;
//             revisedState = {
//               ...revisedState,
//               allTaskDefinitionsCache,
//               mostRecentTaskDefinitionIdSaved: taskDefinitionId,
//             };
//           } else {
//             console.log('TaskStore task-definition-save NOT updated or saved.');
//           }
//         } else {
//           console.log('TaskStore task-definition-save MISSING taskDefinitionId:', taskDefinitionId);
//         }
//         return revisedState;
//
//       case 'task-group-list-retrieve':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         // console.log('TaskStore task-group-list-retrieve taskGroupList:', action.res.taskGroupList);
//         if (action.res.isSearching && action.res.isSearching === true) {
//           // console.log('TaskStore isSearching:', action.res.isSearching);
//           searchResults = action.res.taskGroupList;
//           // console.log('TaskStore searchResults:', searchResults);
//           revisedState = {
//             ...revisedState,
//             searchResults,
//           };
//         }
//         if (action.res.taskGroupList) {
//           action.res.taskGroupList.forEach((taskGroup) => {
//             // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
//             if (taskGroup && (taskGroup.id >= 0)) {
//               allTaskGroupsCache[taskGroup.id] = taskGroup;
//             }
//           });
//           // console.log('allTaskGroupsCache:', allTaskGroupsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskGroupsCache,
//           };
//         }
//         // console.log('TaskStore revisedState:', revisedState);
//         return revisedState;
//
//       case 'task-group-save':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         if (action.res.taskGroupId >= 0) {
//           taskGroupId = action.res.taskGroupId;
//         } else {
//           taskGroupId = -1;
//         }
//
//         if (taskGroupId >= 0) {
//           // console.log('TaskStore task-group-save taskGroupId:', taskGroupId);
//           allTaskGroupsCache[taskGroupId] = action.res;
//           revisedState = {
//             ...revisedState,
//             allTaskGroupsCache,
//             mostRecentTaskGroupIdSaved: taskGroupId,
//           };
//         } else {
//           console.log('TaskStore task-group-save MISSING taskGroupId:', taskGroupId);
//         }
//         return revisedState;
//
//       case 'task-save':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         missingRequiredVariable = false;
//         revisedState = state;
//         if (action.res.personId >= 0) {
//           personId = action.res.personId;
//         } else {
//           personId = -1;
//           missingRequiredVariable = true;
//         }
//         if (action.res.taskDefinitionId >= 0) {
//           taskDefinitionId = action.res.taskDefinitionId;
//         } else {
//           taskDefinitionId = -1;
//           missingRequiredVariable = true;
//         }
//
//         if (!missingRequiredVariable) {
//           // console.log('TaskStore task-save personId:', personId, ', taskDefinitionId:', taskDefinitionId);
//           allTasksCache[personId][taskDefinitionId] = action.res;
//           revisedState = {
//             ...revisedState,
//             allTasksCache,
//           };
//         } else {
//           console.log('TaskStore task-save MISSING_REQUIRED_VARIABLE personId:', personId, ', taskDefinitionId:', taskDefinitionId);
//         }
//         return revisedState;
//
//       case 'task-status-list-retrieve':
//         if (!action.res.success) {
//           console.log('TaskStore ', action.type, ' FAILED action.res:', action.res);
//           return state;
//         }
//         revisedState = state;
//         // console.log('TaskStore task-definition-list-retrieve taskDefinitionList:', action.res.taskDefinitionList);
//         if (action.res.taskDefinitionList) {
//           action.res.taskDefinitionList.forEach((taskDefinition) => {
//             // console.log('TaskStore task-definition-list-retrieve adding taskDefinition:', taskDefinition);
//             if (taskDefinition && (taskDefinition.id >= 0)) {
//               allTaskDefinitionsCache[taskDefinition.id] = taskDefinition;
//             }
//           });
//           // console.log('allTaskDefinitionsCache:', allTaskDefinitionsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskDefinitionsCache,
//           };
//         }
//         if (action.res.taskGroupList) {
//           action.res.taskGroupList.forEach((taskGroup) => {
//             // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
//             if (taskGroup && (taskGroup.id >= 0)) {
//               allTaskGroupsCache[taskGroup.id] = taskGroup;
//             }
//           });
//           // console.log('allTaskGroupsCache:', allTaskGroupsCache);
//           revisedState = {
//             ...revisedState,
//             allTaskGroupsCache,
//           };
//         }
//         if (action.res.taskList) {
//           action.res.taskList.forEach((task) => {
//             // console.log('TaskStore task-group-list-retrieve adding taskGroup:', taskGroup);
//             if (task && (task.personId >= 0)) {
//               if (!allTasksCache[task.personId]) {
//                 allTasksCache[task.personId] = {};
//               }
//               if (task && (task.taskDefinitionId >= 0)) {
//                 allTasksCache[task.personId][task.taskDefinitionId] = task;
//               } else {
//                 console.log('TaskStore task-group-list-retrieve skipping task with missing personId:', task);
//               }
//             } else {
//               console.log('TaskStore task-group-list-retrieve skipping task with missing taskDefinitionId:', task);
//             }
//           });
//           // console.log('allTasksCache:', allTasksCache);
//           revisedState = {
//             ...revisedState,
//             allTasksCache,
//           };
//         }
//         // console.log('TaskStore revisedState:', revisedState);
//         return revisedState;
//
//       default:
//         return state;
//     }
//   }
// }
//
// export default new TaskStore(Dispatcher);
