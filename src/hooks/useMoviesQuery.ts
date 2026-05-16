import { useQuery, UseQueryResult } from 'react-query';
import { getMovies } from '../api/tmdb-api';
import { DiscoverMovieOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache a list of discovered movies using react-query
 * Query key: ['movies', page]
 * 
 * @param page - Page number for pagination
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useMoviesQuery = (page: number = 1): UseQueryResult<DiscoverMovieOverviewProps[], Error> => {
  return useQuery<DiscoverMovieOverviewProps[], Error>(
    ['movies', page],
    () => getMovies(page),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
      // Can override here if needed per specific query
    }
  );
};

export default useMoviesQuery;
