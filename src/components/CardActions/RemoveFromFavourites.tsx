import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMoviesContext } from '../../contexts/MoviesContext';

interface RemoveFromFavouritesProps {
  movieId: number;
}

/**
 * RemoveFromFavourites action component for movie cards
 * Displays a "Remove from Favourites" button that removes the movie from shared context
 * Only shown when the movie is already a favourite
 */
const RemoveFromFavourites = ({ movieId }: RemoveFromFavouritesProps) => {
  const { isFavourite, removeFromFavourites } = useMoviesContext();

  // Only render if already favourite
  if (!isFavourite(movieId)) {
    return null;
  }

  const handleClick = () => {
    removeFromFavourites(movieId);
  };

  return (
    <Button
      size="small"
      color="primary"
      startIcon={<DeleteIcon />}
      onClick={handleClick}
    >
      Remove
    </Button>
  );
};

export default RemoveFromFavourites;
