import React from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Grid, Typography, Box, CircularProgress, Alert, Chip } from "@mui/material";
import useTVSeriesDetailsQuery from "../hooks/useTVSeriesDetailsQuery";

const imageUrl = "https://image.tmdb.org/t/p/w342";

const TVSeriesDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: series, isLoading, isError } = useTVSeriesDetailsQuery(id || "");

  if (isLoading) return <CircularProgress />;
  if (isError) return <Alert severity="error">Failed to load TV series details</Alert>;
  if (!series) return <Alert severity="warning">TV series not found</Alert>;

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Poster */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            {series.poster_path && (
              <Box
                component="img"
                src={`${imageUrl}${series.poster_path}`}
                alt={series.name}
                sx={{ width: "100%", borderRadius: 1, mb: 2 }}
              />
            )}
            <Typography variant="h4" gutterBottom>
              {series.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              <strong>Status:</strong> {series.status}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              <strong>First Aired:</strong> {series.first_air_date}
            </Typography>
            {series.last_air_date && (
              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Last Aired:</strong> {series.last_air_date}
              </Typography>
            )}
            <Typography variant="body1" color="textSecondary" gutterBottom>
              <strong>Seasons:</strong> {series.number_of_seasons}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              <strong>Episodes:</strong> {series.number_of_episodes}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Rating:</strong> {series.vote_average.toFixed(1)}/10
            </Typography>
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Overview
            </Typography>
            <Typography variant="body1" paragraph>
              {series.overview || "No overview available."}
            </Typography>
          </Paper>

          {/* Genres */}
          {series.genres.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Genres
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {series.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} />
                ))}
              </Box>
            </Paper>
          )}

          {/* Networks */}
          {series.networks.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Networks
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {series.networks.map((network) => (
                  <Chip key={network.id} label={network.name} variant="outlined" />
                ))}
              </Box>
            </Paper>
          )}

          {/* Production Companies */}
          {series.production_companies.length > 0 && (
            <Paper sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                Production Companies
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {series.production_companies.map((company) => (
                  <Chip key={company.id} label={company.name} variant="outlined" />
                ))}
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default TVSeriesDetails;
