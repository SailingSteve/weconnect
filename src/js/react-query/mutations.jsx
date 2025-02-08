import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn, { METHOD } from './WeConnectQuery';

const useRemoveTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('team-delete', params, METHOD.GET),
    onError: (error) => console.log('error in useRemoveTeamMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('team-list-retrieve'),
  });
};

// Moved to TeamModel.jsx
const useRemoveTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('remove-person-from-team', params, METHOD.GET),
    onError: (error) => console.log('error in useRemoveTeamMemberMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('team-list-retrieve'),
  });
};

const useAddPersonToTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('add-person-to-team', params, METHOD.GET),
    onError: (error) => console.log('error in addPersonToTeamMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('team-list-retrieve'),
  });
};

const useQuestionSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('question-save', params, METHOD.GET),
    onError: (error) => console.log('error in useQuestionSaveMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('question-list-retrieve'),
  });
};

const useQuestionnaireAnswersSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('answer-list-save', params, METHOD.GET),
    onError: (error) => console.log('error in useQuestionnaireAnswersSaveMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('questionnaire-list-retrieve'),
  });
};

const useQuestionnaireSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('questionnaire-save', params, METHOD.GET),
    onError: (error) => console.log('error in useQuestionnaireSaveMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('questionnaire-list-retrieve'),
  });
};

const useTaskDefinitionSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('task-definition-save', params, METHOD.GET),
    onError: (error) => console.log('error in useTaskDefinitionSaveMutation: ', error),
    // onSuccess: () => queryClient.invalidateQueries('task-status-list-retrieve'),
    onSuccess: () => queryClient.invalidateQueries('task-group-retrieve'),
  });
};

const useGroupSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (params) => weConnectQueryFn('task-group-save', params, METHOD.GET),
    onError: (error) => console.log('error in useGroupSaveMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('task-group-retrieve'),
  });
};

// Moved to /models/PersonModel.jsx
const usePersonSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => weConnectQueryFn('person-save', params, METHOD.GET),
    onError: (error) => console.log('error in personSaveMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('team-list-retrieve'),
  });
};

const useSaveTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestParams) => weConnectQueryFn('task-save', requestParams, METHOD.GET),
    onError: (error) => console.log('error in useSaveTaskMutation: ', error),
    onSuccess: () => queryClient.invalidateQueries('task-status-list-retrieve').then(() => {}),
  });
};



export { useRemoveTeamMutation, useRemoveTeamMemberMutation, useAddPersonToTeamMutation,
  useQuestionnaireSaveMutation, useTaskDefinitionSaveMutation, useGroupSaveMutation,
  useQuestionSaveMutation, usePersonSaveMutation, useSaveTaskMutation, useQuestionnaireAnswersSaveMutation };

