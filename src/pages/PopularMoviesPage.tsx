import { useState } from "react";
import { Container, Grid, Box, Typography, Button, Stack } from "@mui/material";
import MovieCard from "../components/MovieCard";
import usePopularMoviesQuery from "../hooks/usePopularMoviesQuery";

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

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
          <Typography>Page {page}</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Stack>
    </Container>
  );
};

export default PopularMoviesPage;
