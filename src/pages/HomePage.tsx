import PageTemplate from '../components/TemplateMovieListPage';
import {DiscoverMovieOverviewProps } from "../types/movieAppTypes";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/MovieFilterUI";
import { useQuery } from "react-query";
import Spinner from "../components/Spinner";
import { useState, useEffect } from "react";


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
  const { data, error, isLoading, isError } = useQuery<DiscoverMovieOverviewProps[], Error>("discover", getMovies);
  const { filterValues, setFilterValues, filterFunction } = useFiltering(
    [titleFiltering, genreFiltering]
  );
  const [movies, setMovies] = useState<DiscoverMovieOverviewProps[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavourites = localStorage.getItem("favourites");
    if (savedFavourites && data) {
      const favIds = JSON.parse(savedFavourites).map((m: DiscoverMovieOverviewProps) => m.id);
      const updatedMovies = data.map(m => ({
        ...m,
        favourite: favIds.includes(m.id)
      }));
      setMovies(updatedMovies);
    } else if (data) {
      setMovies(data);
    }
  }, [data]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }


  const changeFilterValues = (type: string, value: string) => {
    const changedFilter = { name: type, value: value };
    const updatedFilterSet =
      type === "title"
        ? [changedFilter, filterValues[1]]
        : [filterValues[0], changedFilter];
    setFilterValues(updatedFilterSet);
  };

  const displayedMovies = filterFunction(movies);

  const addToFavourites = (movieId: number) => {
    const updatedMovies = movies.map(m =>
      m.id === movieId ? { ...m, favourite: !m.favourite } : m
    );
    setMovies(updatedMovies);
    
    // Save to localStorage
    const favourites = updatedMovies.filter(m => m.favourite);
    localStorage.setItem("favourites", JSON.stringify(favourites));
  };

  return (
    <>
      <PageTemplate
        title="Discover Movies"
        movies={displayedMovies}
        selectFavourite={addToFavourites}
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
