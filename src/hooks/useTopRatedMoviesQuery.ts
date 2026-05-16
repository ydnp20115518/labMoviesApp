import { useQuery, UseQueryResult } from 'react-query';
import { getTopRatedMovies } from '../api/tmdb-api';
import { DiscoverMovieOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache top-rated movies using react-query
 * Query key: ['movies', 'toprated', page]
 * 
 * @param page - Page number for pagination
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useTopRatedMoviesQuery = (page: number = 1): UseQueryResult<DiscoverMovieOverviewProps[], Error> => {
  return useQuery<DiscoverMovieOverviewProps[], Error>(
    ['movies', 'toprated', page],
    () => getTopRatedMovies(page),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useTopRatedMoviesQuery;
