// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import weConnectQueryFn from './WeConnectQuery';
//
// const useRemoveTeamMutation = () => {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (params) => weConnectQueryFn('team-delete', params),
//     onError: (error) => {
//       console.log('error in useCreatePost: ', error);
//     },
//     onSuccess: () => {
//       // Invalidate the 'posts' query to trigger a refetch
//       queryClient.invalidateQueries('team-list-retrieve');
//     },
//   });
// };
//
//
// export  default useRemoveTeamMutation;
//
