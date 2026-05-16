import { useQuery, UseQueryResult } from 'react-query';
import { getMovie } from '../api/tmdb-api';
import { MovieDetailsProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache a single movie's details using react-query
 * Query key: ['movie', id]
 * 
 * @param {string | number} id - The movie ID to fetch
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useMovieQuery = (id: string | number): UseQueryResult<MovieDetailsProps, Error> => {
  return useQuery<MovieDetailsProps, Error>(
    ['movie', id],
    () => getMovie(String(id)),
    {
      enabled: !!id, // Only run query if id is provided
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useMovieQuery;
