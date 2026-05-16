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





