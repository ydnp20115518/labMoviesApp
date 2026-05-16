import { useQuery, UseQueryResult } from 'react-query';
import { getActorDetails } from '../api/tmdb-api';
import { ActorDetailsProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache actor details using react-query
 * Query key: ['actor', id]
 * 
 * @param id - Actor ID
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useActorDetailsQuery = (id: string | number): UseQueryResult<ActorDetailsProps, Error> => {
  return useQuery<ActorDetailsProps, Error>(
    ['actor', id],
    () => getActorDetails(id),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useActorDetailsQuery;
