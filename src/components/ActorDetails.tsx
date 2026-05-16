import React from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Grid, Typography, Box, CircularProgress, Alert } from "@mui/material";
import useActorDetailsQuery from "../hooks/useActorDetailsQuery";
import useActorMoviesQuery from "../hooks/useActorMoviesQuery";
import MovieCard from "./MovieCard";

const imageUrl = "https://image.tmdb.org/t/p/w342";

const ActorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: actor, isLoading: actorLoading, isError: actorError } = useActorDetailsQuery(id || "");
  const { data: movies = [], isLoading: moviesLoading } = useActorMoviesQuery(id || "");

  if (actorLoading) return <CircularProgress />;
  if (actorError) return <Alert severity="error">Failed to load actor details</Alert>;
  if (!actor) return <Alert severity="warning">Actor not found</Alert>;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Actor Profile */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            {actor.profile_path && (
              <Box
                component="img"
                src={`${imageUrl}${actor.profile_path}`}
                alt={actor.name}
                sx={{ width: "100%", borderRadius: 1, mb: 2 }}
              />
            )}
            <Typography variant="h4" gutterBottom>
              {actor.name}
            </Typography>
            {actor.place_of_birth && (
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Place of Birth:</strong> {actor.place_of_birth}
              </Typography>
            )}
            {actor.birthday && (
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Birthday:</strong> {actor.birthday}
              </Typography>
            )}
            {actor.deathday && (
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Died:</strong> {actor.deathday}
              </Typography>
            )}
            <Typography variant="body1" color="textSecondary" gutterBottom>
              <strong>Department:</strong> {actor.known_for_department}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Popularity:</strong> {actor.popularity.toFixed(1)}
            </Typography>
          </Paper>
        </Grid>

        {/* Biography and Filmography */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Biography
            </Typography>
            <Typography variant="body1" paragraph>
              {actor.biography || "No biography available."}
            </Typography>
          </Paper>

          {/* Filmography */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Filmography
            </Typography>
            {moviesLoading ? (
              <CircularProgress />
            ) : movies.length > 0 ? (
              <Grid container spacing={2}>
                {movies.slice(0, 8).map((movie) => (
                  <Grid item xs={12} sm={6} md={4} key={movie.id}>
                    <MovieCard
                      movie={{
                        adult: false,
                        backdrop_path: undefined,
                        genre_ids: [],
                        id: movie.id,
                        original_language: "",
                        original_title: movie.title,
                        overview: "",
                        popularity: 0,
                        poster_path: movie.poster_path || undefined,
                        release_date: movie.release_date,
                        title: movie.title,
                        video: false,
                        vote_average: 0,
                        vote_count: 0,
                        favourite: false,
                      } as any}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No filmography available.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ActorDetails;
