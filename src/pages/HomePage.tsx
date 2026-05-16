import { useState } from "react";
import { Box, MenuItem, FormControl, InputLabel, Select, SelectChangeEvent } from "@mui/material";
import PageTemplate from '../components/TemplateMovieListPage';
import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/MovieFilterUI";
import useMoviesQuery from "../hooks/useMoviesQuery";
import AddToFavourites from "../components/CardActions/AddToFavourites";

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
  // Fetch movies using react-query hook (server-state caching)
  const { data: movies = [] } = useMoviesQuery();
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
    <>
      <Box sx={{ mb: 2 }}>
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
      <MovieFilterUI
        onFilterValuesChange={changeFilterValues}
        titleFilter={filterValues[0].value}
        genreFilter={filterValues[1].value}
      />
    </>
  );
};
export default HomePage;
