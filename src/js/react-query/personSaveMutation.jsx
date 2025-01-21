import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn from './WeConnectQuery';

const usePersonSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => weConnectQueryFn('person-save', params),
    onError: (error) => {
      console.log('error in personSaveMutation: ', error);
    },
    onSuccess: () => {
      // Invalidate the 'posts' query to trigger a refetch
      queryClient.invalidateQueries('team-list-retrieve');
    },
  });
};


export default usePersonSaveMutation;

