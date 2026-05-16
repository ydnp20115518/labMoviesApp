import { useQuery, UseQueryResult } from 'react-query';
import { getPopularMovies } from '../api/tmdb-api';
import { DiscoverMovieOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache popular movies using react-query
 * Query key: ['movies', 'popular', page]
 * 
 * @param page - Page number for pagination
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const usePopularMoviesQuery = (page: number = 1): UseQueryResult<DiscoverMovieOverviewProps[], Error> => {
  return useQuery<DiscoverMovieOverviewProps[], Error>(
    ['movies', 'popular', page],
    () => getPopularMovies(page),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default usePopularMoviesQuery;
