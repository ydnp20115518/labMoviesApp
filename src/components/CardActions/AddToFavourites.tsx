import Button from '@mui/material/Button';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMoviesContext } from '../../contexts/MoviesContext';

interface AddToFavouritesProps {
  movieId: number;
}

/**
 * AddToFavourites action component for movie cards
 * Displays an "Add to Favourites" button that adds the movie to shared context
 * Only shown when the movie is not already a favourite
 */
const AddToFavourites = ({ movieId }: AddToFavouritesProps) => {
  const { isFavourite, addToFavourites } = useMoviesContext();

  // Don't render if already favourite
  if (isFavourite(movieId)) {
    return null;
  }

  const handleClick = () => {
    addToFavourites(movieId);
  };

  return (
    <Button
      size="small"
      color="primary"
      startIcon={<FavoriteBorderIcon />}
      onClick={handleClick}
    >
      Add to Favourites
    </Button>
  );
};

export default AddToFavourites;
