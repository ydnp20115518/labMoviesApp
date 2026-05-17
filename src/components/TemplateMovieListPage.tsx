import Header from "./HeaderMovieList";
import Grid from "@mui/material/Grid";
import MovieList from "./MovieList";
import { MovieListPageTemplateProps } from "../types/movieAppTypes";

const styles = {
  root: {
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
  },
  title: { position: "sticky", top: 64, zIndex: 99, backgroundColor: "#ffffff", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", width: "100%" }
};

const MovieListPageTemplate = ({ movies, title, renderActions }: MovieListPageTemplateProps) => {
  return (
    <Grid container sx={{ ...styles.root, display: "flex", flexDirection: "column" }}>
      <Grid sx={styles.title}>
        <Header title={title} />
      </Grid>
      <Grid container spacing={5}>
        <MovieList
          renderActions={renderActions}
          movies={movies}
        ></MovieList>
      </Grid>
    </Grid>
  );
}
export default MovieListPageTemplate;
