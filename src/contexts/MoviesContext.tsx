import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

/**
 * Interface for the Movies Context shape
 */
interface MoviesContextInterface {
  favouriteIds: number[];
  addToFavourites: (movieId: number) => void;
  removeFromFavourites: (movieId: number) => void;
  isFavourite: (movieId: number) => boolean;
}

/**
 * Initial context state
 */
const initialContextState: MoviesContextInterface = {
  favouriteIds: [],
  addToFavourites: () => {},
  removeFromFavourites: () => {},
  isFavourite: () => false,
};

/**
 * Create the MoviesContext
 */
export const MoviesContext = createContext<MoviesContextInterface>(initialContextState);

/**
 * MoviesProvider component that manages shared favourites state
 * Persists favourites to localStorage and hydrates on mount
 */
interface MoviesProviderProps {
  children: ReactNode;
}

export const MoviesProvider: React.FC<MoviesProviderProps> = ({ children }) => {
  const [favouriteIds, setFavouriteIds] = useState<number[]>([]);

  /**
   * Hydrate favourites from localStorage on mount
   */
  useEffect(() => {
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
      try {
        const parsed = JSON.parse(storedFavourites);
        // Handle both array format and legacy object format
        if (Array.isArray(parsed)) {
          setFavouriteIds(parsed);
        } else if (Array.isArray(parsed.results)) {
          // Legacy format compatibility
          setFavouriteIds(parsed.results);
        }
      } catch (error) {
        console.error('Failed to parse stored favourites:', error);
        setFavouriteIds([]);
      }
    }
  }, []);

  /**
   * Add a movie ID to favourites and persist to localStorage
   */
  const addToFavourites = (movieId: number) => {
    setFavouriteIds((prevIds) => {
      if (prevIds.includes(movieId)) {
        return prevIds;
      }
      const updated = [...prevIds, movieId];
      localStorage.setItem('favourites', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Remove a movie ID from favourites and persist to localStorage
   */
  const removeFromFavourites = (movieId: number) => {
    setFavouriteIds((prevIds) => {
      const updated = prevIds.filter((id) => id !== movieId);
      localStorage.setItem('favourites', JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Check if a movie ID is in favourites
   */
  const isFavourite = (movieId: number): boolean => {
    return favouriteIds.includes(movieId);
  };

  const value: MoviesContextInterface = {
    favouriteIds,
    addToFavourites,
    removeFromFavourites,
    isFavourite,
  };

  return (
    <MoviesContext.Provider value={value}>
      {children}
    </MoviesContext.Provider>
  );
};

/**
 * Custom hook to consume MoviesContext
 * Throws error if used outside of MoviesProvider
 */
export const useMoviesContext = (): MoviesContextInterface => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMoviesContext must be used within a MoviesProvider');
  }
  return context;
};
