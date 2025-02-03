import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { httpLog } from '../common/utils/logging';
import webAppConfig from '../config';

// https://refine.dev/blog/react-query-guide/#performing-basic-data-fetching
// Define a default query function that will receive the query key
const weConnectQueryFn = async (queryKey, params) => {
  // console.log('weConnectQueryFn params: ', params);
  const url = new URL(`${queryKey}/`, webAppConfig.STAFF_API_SERVER_API_ROOT_URL);
  url.search = new URLSearchParams(params);
  // console.log('weConnectQueryFn ZZZ url.href: ', url.href);

  const response = await axios.get(url.href);
  // console.log('weConnectQueryFn  response.data: ', JSON.stringify(response.data));

  return response.data;
};

const useFetchData = (queryKey, fetchParams) => {
  httpLog('useFetchData queryKey: ', queryKey, '  fetchParams: ', fetchParams);
  const { data, isSuccess, isFetching, isStale, refetch, error } = useQuery({
    queryKey,
    queryFn: () => weConnectQueryFn(queryKey, fetchParams),
    networkMode: 'always', // We can back this off once we achieve MVP version 1
  });
  if (error) {
    console.log(`An error occurred with ${queryKey}: ${error.message}`);
  }
  return { data, isSuccess, isFetching, isStale, refetch };
};


export default weConnectQueryFn;
export { useFetchData };
