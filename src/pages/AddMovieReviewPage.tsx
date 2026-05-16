import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface ReviewFormData {
  author: string;
  title: string;
  comment: string;
}

/**
 * AddMovieReviewPage component
 * Page for users to write and submit a review for a specific movie
 * Route: /movies/:id/review
 */
const AddMovieReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      author: '',
      title: '',
      comment: '',
    },
  });

  const movieId = parseInt(id || '0', 10);

  /**
   * Handle form submission
   * In Task 9.0, this will be integrated with review storage
   * For now, navigate back to home
   */
  const onSubmit = (data: ReviewFormData) => {
    // TODO: Task 9.0 - Store review in app state
    console.log('Review submitted:', { movieId, ...data });
    
    // Navigate back to home after submission
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Write a Review
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Movie ID: {movieId}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          {/* Review Author Field */}
          <Controller
            name="author"
            control={control}
            rules={{
              required: 'Author is required',
              maxLength: {
                value: 100,
                message: 'Author must be 100 characters or less',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Author"
                placeholder="Your name"
                error={!!errors.author}
                helperText={errors.author?.message}
                margin="normal"
                variant="outlined"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />

          {/* Review Title Field */}
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Title is required',
              maxLength: {
                value: 100,
                message: 'Title must be 100 characters or less',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Review Title"
                placeholder="Brief title for your review"
                error={!!errors.title}
                helperText={errors.title?.message}
                margin="normal"
                variant="outlined"
                inputProps={{ maxLength: 100 }}
              />
            )}
          />

          {/* Review Comment Field */}
          <Controller
            name="comment"
            control={control}
            rules={{
              required: 'Comment is required',
              maxLength: {
                value: 500,
                message: 'Comment must be 500 characters or less',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Review Comment"
                placeholder="Write your detailed review here..."
                error={!!errors.comment}
                helperText={errors.comment?.message}
                margin="normal"
                variant="outlined"
                multiline
                rows={5}
                inputProps={{ maxLength: 500 }}
              />
            )}
          />

          {/* Form Actions */}
          <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit Review
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddMovieReviewPage;
