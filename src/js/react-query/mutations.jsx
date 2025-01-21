import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn from './WeConnectQuery';

const useRemoveTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => weConnectQueryFn('team-delete', params),
    onError: (error) => {
      console.log('error in useRemoveTeamMutation: ', error);
    },
    onSuccess: () => {
      // Invalidate the 'posts' query to trigger a refetch
      queryClient.invalidateQueries('team-list-retrieve');
    },
  });
};


const useRemoveTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => weConnectQueryFn('remove-person-from-team', params),
    onError: (error) => {
      console.log('error in useRemoveTeamMemberMutation: ', error);
    },
    onSuccess: () => {
      // Invalidate the 'posts' query to trigger a refetch
      queryClient.invalidateQueries('team-list-retrieve');
    },
  });
};

const useAddPersonToTeamMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => weConnectQueryFn('add-person-to-team', params),
    onError: (error) => {
      console.log('error in addPersonToTeamMutation: ', error);
    },
    onSuccess: () => {
      // Invalidate the 'posts' query to trigger a refetch
      queryClient.invalidateQueries('team-list-retrieve');
    },
  });
};


export  { useRemoveTeamMutation, useRemoveTeamMemberMutation, useAddPersonToTeamMutation };

