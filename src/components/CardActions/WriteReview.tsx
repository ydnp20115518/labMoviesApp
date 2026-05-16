import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

interface WriteReviewProps {
  movieId: number;
}

/**
 * WriteReview action component for movie cards
 * Displays a "Write Review" button that navigates to the review form page
 * Typically shown on the Favourites page for favourite movies
 */
const WriteReview = ({ movieId }: WriteReviewProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movieId}/review`);
  };

  return (
    <Button
      size="small"
      color="primary"
      startIcon={<EditIcon />}
      onClick={handleClick}
    >
      Write Review
    </Button>
  );
};

export default WriteReview;
