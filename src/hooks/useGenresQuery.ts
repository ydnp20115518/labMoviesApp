import { useQuery, UseQueryResult } from 'react-query';
import { getGenres } from '../api/tmdb-api';

export interface Genre {
  id: number;
  name: string;
}

/**
 * Custom hook to fetch and cache genres using react-query
 * Query key: ['genres']
 * 
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useGenresQuery = (): UseQueryResult<Genre[], Error> => {
  return useQuery<Genre[], Error>(
    ['genres'],
    () => getGenres(),
    {
      // Use defaults from QueryClient with these overrides
      staleTime: 24 * 60 * 60 * 1000, // 24 hours - genres don't change often
      cacheTime: 24 * 60 * 60 * 1000, // 24 hours
    }
  );
};

export default useGenresQuery;
