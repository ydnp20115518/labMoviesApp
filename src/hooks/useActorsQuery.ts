import { useQuery, UseQueryResult } from 'react-query';
import { getActors } from '../api/tmdb-api';
import { ActorOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache popular actors using react-query
 * Query key: ['actors', 'popular', page]
 * 
 * @param page - Page number for pagination
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useActorsQuery = (page: number = 1): UseQueryResult<ActorOverviewProps[], Error> => {
  return useQuery<ActorOverviewProps[], Error>(
    ['actors', 'popular', page],
    () => getActors(page),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useActorsQuery;
