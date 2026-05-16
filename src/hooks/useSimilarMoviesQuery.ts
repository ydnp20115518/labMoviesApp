import { useQuery, UseQueryResult } from 'react-query';
import { getSimilarMovies } from '../api/tmdb-api';
import { DiscoverMovieOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache similar movies using react-query
 * Query key: ['movies', movieId, 'similar', page]
 * 
 * @param movieId - Movie ID to find similar movies for
 * @param page - Page number for pagination
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useSimilarMoviesQuery = (movieId: string | number, page: number = 1): UseQueryResult<DiscoverMovieOverviewProps[], Error> => {
  return useQuery<DiscoverMovieOverviewProps[], Error>(
    ['movies', movieId, 'similar', page],
    () => getSimilarMovies(movieId, page),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useSimilarMoviesQuery;
