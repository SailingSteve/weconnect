// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import weConnectQueryFn from './WeConnectQuery';
//
// const useRemoveTeamMember = () => {
//   const queryClient = useQueryClient();
//
//   return useMutation({
//     mutationFn: (params) => weConnectQueryFn('remove-person-from-team', params),
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
// export  { useRemoveTeamMember };
//
