import { useQuery, UseQueryResult } from 'react-query';
import { getTVSeries } from '../api/tmdb-api';
import { TVSeriesOverviewProps } from '../types/movieAppTypes';

/**
 * Custom hook to fetch and cache TV series using react-query
 * Query key: ['tv', 'series', page]
 * 
 * @param page - Page number for pagination
 * @returns {UseQueryResult} Object with data, isLoading, isError, error
 */
export const useTVSeriesQuery = (page: number = 1): UseQueryResult<TVSeriesOverviewProps[], Error> => {
  return useQuery<TVSeriesOverviewProps[], Error>(
    ['tv', 'series', page],
    () => getTVSeries(page),
    {
      // Use defaults from QueryClient (5min staleTime, 10min cacheTime)
    }
  );
};

export default useTVSeriesQuery;
