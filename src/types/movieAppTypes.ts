// src/types/tmdb.ts

import { paths } from "./generated/tmdb";

// Type for the API response when discovering movies
export type DiscoverMoviesProps = paths["/3/discover/movie"]["get"]["responses"][200]["content"]["application/json"];

// Type for a single movie object from the discover movies response
export type DiscoverMovieOverviewProps =  NonNullable<DiscoverMoviesProps["results"]>[number] & {
favourite: boolean;
};

// Props interface for components that display a list of movies
export type BaseMovieListProps  ={
  movies: NonNullable<DiscoverMovieOverviewProps[]>;
  renderActions?: (movie: DiscoverMovieOverviewProps) => React.ReactNode;
}

export type MovieDetailsProps = paths["/3/movie/{movie_id}"]["get"]["responses"][200]["content"]["application/json"] & {
favourite: boolean;
};

export type MovieImage = {
  file_path: string;
  aspect_ratio?: number; //some props are optional...
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export type MoviePageProps = {
  movie: MovieDetailsProps;
  images: MovieImage[];
}

export type FilterOption = "title" | "genre";

export interface MovieListPageTemplateProps extends BaseMovieListProps {
  title: string;
}

export type MovieReviewsProps = paths["/3/movie/{movie_id}/reviews"]["get"]["responses"][200]["content"]["application/json"];

export type MovieReviewProps = NonNullable<MovieReviewsProps["results"]>[number];

export type ActorOverviewProps = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  known_for: Array<{
    id: number;
    title?: string;
    name?: string;
    media_type: string;
    poster_path: string | null;
  }>;
};

export type ActorDetailsProps = {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  imdb_id: string | null;
};

export type ActorMovieCreditsProps = {
  id: number;
  title: string;
  character: string;
  poster_path: string | null;
  release_date: string;
  popularity: number;
};

export type TVSeriesOverviewProps = {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

export type TVSeriesDetailsProps = {
  id: number;
  name: string;
  first_air_date: string;
  last_air_date: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  overview: string;
  genres: Array<{ id: number; name: string }>;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  status: string;
  networks: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string }>;
};

export type PaginatedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};





