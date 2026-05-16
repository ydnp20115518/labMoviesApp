import { useQuery, UseQueryResult } from 'react-query';
import { getMovieReviews } from '../api/tmdb-api';
import { MovieReviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache movie reviews using react-query
 * Query key: ['movie', id, 'reviews']
 * 
 * @param {string | number} id - The movie ID to fetch reviews for
 * @returns {UseQueryResult} Object with data array, isLoading, isError, error
 */
export const useMovieReviewsQuery = (id: string | number): UseQueryResult<MovieReviewProps[], Error> => {
  return useQuery<MovieReviewProps[], Error>(
    ['movie', id, 'reviews'],
    () => getMovieReviews(id),
    {
      enabled: !!id, // Only run query if id is provided
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useMovieReviewsQuery;
