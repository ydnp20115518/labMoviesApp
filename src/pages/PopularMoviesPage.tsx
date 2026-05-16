import { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import MovieCard from "../components/MovieCard";
import usePopularMoviesQuery from "../hooks/usePopularMoviesQuery";
import PaginationControls from "../components/PaginationControls";

const PopularMoviesPage = () => {
  const [page, setPage] = useState(1);
  const { data: movies = [] } = usePopularMoviesQuery(page);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Popular Movies
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Discover the most popular movies right now
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {movies.map((movie) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      <PaginationControls page={page} onPageChange={setPage} />
    </Container>
  );
};

export default PopularMoviesPage;
