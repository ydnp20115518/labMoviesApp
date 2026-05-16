import { useState } from "react";
import { Container, Grid, Box, Typography, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem } from "@mui/material";
import ActorCard from "../components/ActorCard";
import useActorsQuery from "../hooks/useActorsQuery";
import PaginationControls from "../components/PaginationControls";

const ActorsPage = () => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"popularity" | "name">("popularity");
  const { data: actors = [] } = useActorsQuery(page);

  const handleSortChange = (event: SelectChangeEvent<"popularity" | "name">) => {
    setSortBy(event.target.value as "popularity" | "name");
  };

  const sortedActors = [...actors].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.popularity - a.popularity;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Popular Actors
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Discover popular actors in the entertainment industry
          </Typography>
        </Box>

        {/* Sorting */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="popularity">Popularity (High to Low)</MenuItem>
            <MenuItem value="name">Name (A to Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {sortedActors.map((actor) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={actor.id}>
            <ActorCard actor={actor} />
          </Grid>
        ))}
      </Grid>

      <PaginationControls page={page} onPageChange={setPage} />
    </Container>
  );
};

export default ActorsPage;
