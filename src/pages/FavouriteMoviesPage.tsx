import PageTemplate from "../components/TemplateMovieListPage";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, { genreFilter, titleFilter } from "../components/MovieFilterUI";
import { useMoviesContext } from "../contexts/MoviesContext";
import useFavouriteMovies from "../hooks/useFavouriteMovies";
import RemoveFromFavourites from "../components/CardActions/RemoveFromFavourites";
import WriteReview from "../components/CardActions/WriteReview";
import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";
import Box from "@mui/material/Box";

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

const FavouriteMoviesPage = () => {
  // Get favourite IDs from context
  const { favouriteIds } = useMoviesContext();

  // Fetch detailed information for all favourites using react-query
  const favouriteMovies = useFavouriteMovies(favouriteIds);

  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );

  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title" ? [changedFilter, filterValues[1]] : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  const displayedMovies = filterFunction(favouriteMovies);

  // Render both RemoveFromFavourites and WriteReview actions for each movie
  const renderActions = (movie: DiscoverMovieOverviewProps) => (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <RemoveFromFavourites movieId={movie.id} />
      <WriteReview movieId={movie.id} />
    </Box>
  );

  return (
    <>
      <PageTemplate
        title="Favourite Movies"
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

export default FavouriteMoviesPage;
