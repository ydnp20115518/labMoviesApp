import { useState, useEffect } from "react";
import PageTemplate from '../components/TemplateMovieListPage';
import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";// Changed
import { getMovies } from "../api/tmdb-api";

const HomePage = () => {
  const [movies, setMovies] = useState<DiscoverMovieOverviewProps[]>([]); // Changed
  const favourites = movies.filter(m => m.favourite)
  localStorage.setItem('favourites', JSON.stringify(favourites))
  // New function
  const addToFavourites = (movieId: number) => {
    const updatedMovies = movies.map((m: DiscoverMovieOverviewProps) =>
      m.id === movieId ? { ...m, favourite: true } : m
    );
    setMovies(updatedMovies);
  };

 useEffect(() => {
    getMovies().then(movies => {
      setMovies(movies);
    });
  }, []);

  return (
    <PageTemplate
      title='Discover Movies'
      movies={movies}
      selectFavourite={addToFavourites}
    />
  );
};
export default HomePage;
