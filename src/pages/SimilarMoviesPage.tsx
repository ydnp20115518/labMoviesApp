import { useParams } from "react-router-dom";
import { Container, Grid, Box, Typography, Button, Stack, CircularProgress } from "@mui/material";
import MovieCard from "../components/MovieCard";
import useSimilarMoviesQuery from "../hooks/useSimilarMoviesQuery";

const SimilarMoviesPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { data: movies = [], isLoading } = useSimilarMoviesQuery(movieId || "", 1);

  if (isLoading) {
    return (
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Similar Movies
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Movies similar to the one you're viewing
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {movies.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No similar movies found.
        </Typography>
      )}
    </Container>
  );
};

export default SimilarMoviesPage;
