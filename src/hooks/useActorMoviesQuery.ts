import { useQuery, UseQueryResult } from 'react-query';
import { getActorMovies } from '../api/tmdb-api';
import { ActorMovieCreditsProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache actor's filmography using react-query
 * Query key: ['actor', id, 'movies']
 * 
 * @param id - Actor ID
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useActorMoviesQuery = (id: string | number): UseQueryResult<ActorMovieCreditsProps[], Error> => {
  return useQuery<ActorMovieCreditsProps[], Error>(
    ['actor', id, 'movies'],
    () => getActorMovies(id),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useActorMoviesQuery;
