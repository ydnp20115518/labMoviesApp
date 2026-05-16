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

const HomePage = () => {
  // Fetch movies using react-query hook (server-state caching)
  const { data: movies = [] } = useMoviesQuery();

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

  const displayedMovies = filterFunction(movies);

  // Render AddToFavourites action for each movie
  const renderActions = (movie: DiscoverMovieOverviewProps) => (
    <AddToFavourites movieId={movie.id} />
  );

  return (
    <>
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
