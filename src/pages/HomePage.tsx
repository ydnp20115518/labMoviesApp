import { useState } from "react";
import { Box, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent, Container } from "@mui/material";
import PageTemplate from '../components/TemplateMovieListPage';
import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/MovieFilterUI";
import useMoviesQuery from "../hooks/useMoviesQuery";
import AddToFavourites from "../components/CardActions/AddToFavourites";
import PaginationControls from "../components/PaginationControls";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};
const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

type SortOption = "title" | "rating-asc" | "rating-desc" | "popularity";

const HomePage = () => {
  const [page, setPage] = useState(1);
  // Fetch movies using react-query hook (server-state caching)
  const { data: movies = [] } = useMoviesQuery(page);
  const [sortBy, setSortBy] = useState<SortOption>("popularity");

  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title"
        ? [changedFilter, filterValues[1]]
        : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  let displayedMovies = filterFunction(movies);

  displayedMovies = [...displayedMovies].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
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

  // Render AddToFavourites action for each movie
  const renderActions = (movie: DiscoverMovieOverviewProps) => (
    <AddToFavourites movieId={movie.id} />
  );

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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
        }}
      >
        <MovieFilterUI
          onFilterValuesChange={changeFilterValues}
          titleFilter={filterValues[0].value}
          genreFilter={filterValues[1].value}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort By"
          >
            <MenuItem value="popularity">Popularity (High to Low)</MenuItem>
            <MenuItem value="title">Title (A to Z)</MenuItem>
            <MenuItem value="rating-desc">Rating (High to Low)</MenuItem>
            <MenuItem value="rating-asc">Rating (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <PageTemplate
        title='Discover Movies'
        movies={displayedMovies}
        renderActions={renderActions}
      />
      <PaginationControls page={page} onPageChange={setPage} />
    </Container>
  );
};
export default HomePage;
