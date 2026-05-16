import { useMemo } from 'react';
import useMovieReviewsQuery from './useMovieReviewsQuery';
import { useReviewsContext, Review } from '../contexts/ReviewsContext';

export interface CombinedReview extends Review {
  isUserSubmitted?: boolean;
}

/**
 * Custom hook to get all reviews for a movie (API + user-submitted)
 * Combines TMDB API reviews with user-submitted reviews from ReviewsContext
 * 
 * @param movieId - The ID of the movie to get reviews for
 * @returns Array of all reviews (both API and user-submitted)
 */
const useReviewsByMovieId = (movieId: number): CombinedReview[] => {
  // Get API reviews from react-query
  const { data: apiReviews = [] } = useMovieReviewsQuery(movieId);

  // Get user-submitted reviews from context
  const { getReviewsByMovieId } = useReviewsContext();
  const userReviews = useMemo(
    () => getReviewsByMovieId(movieId),
    [movieId, getReviewsByMovieId]
  );

  // Combine and mark user-submitted reviews
  const allReviews = useMemo(() => {
    const combined: CombinedReview[] = [
      // Add user-submitted reviews with isUserSubmitted flag
      ...userReviews.map(review => ({
        ...review,
        isUserSubmitted: true,
      })),
      // Add API reviews
      ...apiReviews.map((review: any) => ({
        id: review.id,
        movieId: movieId,
        author: review.author,
        title: review.title || 'TMDB Review',
        content: review.content,
        createdAt: review.updated_at ? new Date(review.updated_at).getTime() : 0,
        isUserSubmitted: false,
      })),
    ];

    // Sort by createdAt descending (newest first)
    return combined.sort((a, b) => b.createdAt - a.createdAt);
  }, [movieId, apiReviews, userReviews]);

  return allReviews;
};

export default useReviewsByMovieId;
