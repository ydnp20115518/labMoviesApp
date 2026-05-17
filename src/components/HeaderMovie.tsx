
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import { MovieDetailsProps } from "../types/movieAppTypes";
import { Avatar, CardHeader } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

const styles = {
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    padding: 1.5,
  },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
};

const MovieHeader = (movie: MovieDetailsProps) => {
  const favMovies = JSON.parse(localStorage.getItem("favourites") || '[]');
  const isFavourite = favMovies.some((m: MovieDetailsProps) => m.id === movie.id);

  return (
    <Paper component="div" sx={styles.root}>
      <CardHeader
        avatar={
          isFavourite ? (
            <Avatar sx={styles.avatar}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
      />
      <Typography variant="h4" component="h3">
        {movie.title}{"   "}
        <a href={movie.homepage}>
          <HomeIcon color="primary" fontSize="large" />
        </a>
        <br />
        <span>{`${movie.tagline}`} </span>
      </Typography>
    </Paper>
  );
};

export default MovieHeader;
