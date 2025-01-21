import { useMutation, useQueryClient } from '@tanstack/react-query';
import weConnectQueryFn from './WeConnectQuery';

const useQuestionSaveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => weConnectQueryFn('question-save', params),
    onError: (error) => {
      console.log('error in useQuestionSaveMutation: ', error);
    },
    onSuccess: () => {
      // Invalidate the 'posts' query to trigger a refetch
      queryClient.invalidateQueries('question-list-retrieve');
    },
  });
};

export default useQuestionSaveMutation;

