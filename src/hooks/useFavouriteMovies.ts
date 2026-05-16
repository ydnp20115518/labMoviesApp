import { useQueries } from 'react-query';
import { getMovie } from '../api/tmdb-api';
import { DiscoverMovieOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch detailed information for multiple movies by their IDs
 * Uses react-query's useQueries for parallel fetching with caching
 * 
 * @param movieIds - Array of movie IDs to fetch
 * @returns Array of movie objects or empty array if loading
 */
const useFavouriteMovies = (movieIds: number[]): DiscoverMovieOverviewProps[] => {
  // Create a query for each favourite movie ID
  const queries = useQueries(
    movieIds.map(movieId => ({
      queryKey: ['movie', movieId],
      queryFn: () => getMovie(movieId.toString()),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      enabled: movieIds.length > 0, // Only enable if we have IDs
    }))
  );

  // Extract data from all queries, filtering out any errors/undefined
  const movies = queries
    .map(query => query.data)
    .filter((movie): movie is DiscoverMovieOverviewProps => movie !== undefined);

  return movies;
};

export default useFavouriteMovies;
