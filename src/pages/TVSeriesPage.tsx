import { useState } from "react";
import { Container, Grid, Typography, Box, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, TextField } from "@mui/material";
import TVSeriesCard from "../components/TVSeriesCard";
import useTVSeriesQuery from "../hooks/useTVSeriesQuery";
import PaginationControls from "../components/PaginationControls";

type SortOption = "name" | "rating-asc" | "rating-desc" | "popularity";

const TVSeriesPage = () => {
  const [page, setPage] = useState(1);
  const { data: series = [] } = useTVSeriesQuery(page);
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [titleFilter, setTitleFilter] = useState("");

  let displayedSeries = series.filter((s) =>
    s.name.toLowerCase().includes(titleFilter.toLowerCase())
  );

  displayedSeries = [...displayedSeries].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "rating-asc":
        return a.vote_average - b.vote_average;
      case "rating-desc":
        return b.vote_average - a.vote_average;
      case "popularity":
      default:
        return b.popularity - a.popularity;
    }
  });

  const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
    setSortBy(event.target.value as SortOption);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          alignItems: "flex-end",
          position: "sticky",
          top: 64,
          backgroundColor: "#fff",
          zIndex: 100,
          padding: "16px 0",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <TextField
          label="Filter by Name"
          variant="outlined"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="popularity">Popularity (High to Low)</MenuItem>
            <MenuItem value="name">Name (A to Z)</MenuItem>
            <MenuItem value="rating-desc">Rating (High to Low)</MenuItem>
            <MenuItem value="rating-asc">Rating (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h3" component="h1" gutterBottom>
        Popular TV Series
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Discover the most popular TV series right now
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {displayedSeries.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={s.id}>
            <TVSeriesCard series={s} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <PaginationControls page={page} onPageChange={setPage} />
      </Box>
    </Container>
  );
};

export default TVSeriesPage;
