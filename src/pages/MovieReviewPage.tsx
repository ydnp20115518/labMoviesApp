import React from "react";
import { useLocation } from "react-router-dom";
import MovieReview from "../components/MovieReview";
import PageTemplate from "../components/TemplateMoviePage";

const MovieReviewPage: React.FC = () => {
  const { state : {movie, review } } = useLocation()
  return (
    <PageTemplate movie={movie}>
      <MovieReview {...review} />
    </PageTemplate>
  );
};

export default MovieReviewPage;
