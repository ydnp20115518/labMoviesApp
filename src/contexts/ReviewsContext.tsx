import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Review {
  id: string;
  movieId: number;
  author: string;
  title: string;
  content: string; // User-friendly name for comment field
  createdAt: number;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (movieId: number, author: string, title: string, comment: string) => void;
  getReviewsByMovieId: (movieId: number) => Review[];
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

/**
 * Provider component for managing user-submitted reviews in app state
 * Reviews are stored in memory (not persisted to localStorage, per spec)
 */
export const ReviewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = (movieId: number, author: string, title: string, comment: string) => {
    const newReview: Review = {
      id: `user-review-${Date.now()}`, // Generate unique ID based on timestamp
      movieId,
      author,
      title,
      content: comment,
      createdAt: Date.now(),
    };

    setReviews([...reviews, newReview]);
  };

  const getReviewsByMovieId = (movieId: number): Review[] => {
    return reviews.filter(review => review.movieId === movieId);
  };

  const value: ReviewsContextType = {
    reviews,
    addReview,
    getReviewsByMovieId,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
};

/**
 * Custom hook to access reviews context
 * Throws error if used outside ReviewsProvider
 */
export const useReviewsContext = (): ReviewsContextType => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error('useReviewsContext must be used within ReviewsProvider');
  }
  return context;
};
