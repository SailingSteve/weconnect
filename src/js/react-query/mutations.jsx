import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn from './WeConnectQuery';

const useRemoveTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('team-delete', params),
    onError: (error) => { console.log('error in useRemoveTeamMutation: ', error); },
    onSuccess: () => { queryClient.invalidateQueries('team-list-retrieve'); },
  });
};


const useRemoveTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('remove-person-from-team', params),
    onError: (error) => { console.log('error in useRemoveTeamMemberMutation: ', error); },
    onSuccess: () => { queryClient.invalidateQueries('team-list-retrieve'); },
  });
};

const useAddPersonToTeamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('add-person-to-team', params),
    onError: (error) => { console.log('error in addPersonToTeamMutation: ', error); },
    onSuccess: () => { queryClient.invalidateQueries('team-list-retrieve'); },
  });
};

const useQuestionnaireSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('questionnaire-save', params),
    onError: (error) => { console.log('error in useQuestionnaireSaveMutation: ', error); },
    onSuccess: () => { queryClient.invalidateQueries('questionnaire-list-retrieve'); },
  });
};

const useTaskDefinitionSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params) => weConnectQueryFn('task-definition-save', params),
    onError: (error) => { console.log('error in useTaskDefinitionSaveMutation: ', error); },
    onSuccess: () => { queryClient.invalidateQueries('task-status-list-retrieve'); },
  });
};

const useGroupSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (params) => weConnectQueryFn('task-group-save', params),
    onError: (error) => { console.log('error in useGroupSaveMutation: ', error); },
    onSuccess: () => { queryClient.invalidateQueries('task-group-retrieve'); },
  });
};

export  { useRemoveTeamMutation, useRemoveTeamMemberMutation, useAddPersonToTeamMutation,
  useQuestionnaireSaveMutation, useTaskDefinitionSaveMutation, useGroupSaveMutation };

