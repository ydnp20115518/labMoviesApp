import { useQuery, UseQueryResult } from 'react-query';
import { getTVSeriesDetails } from '../api/tmdb-api';
import { TVSeriesDetailsProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache TV series details using react-query
 * Query key: ['tv', id]
 * 
 * @param id - TV series ID
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useTVSeriesDetailsQuery = (id: string | number): UseQueryResult<TVSeriesDetailsProps, Error> => {
  return useQuery<TVSeriesDetailsProps, Error>(
    ['tv', id],
    () => getTVSeriesDetails(id),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useTVSeriesDetailsQuery;
