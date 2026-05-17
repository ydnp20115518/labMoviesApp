import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarIcon from "@mui/icons-material/CalendarTodayTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import Grid from "@mui/material/Grid";
import img from '../images/film-poster-placeholder.png';
import { DiscoverMovieOverviewProps } from "../types/movieAppTypes";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";

const styles = {
  card: { maxWidth: 345, height: "100%", display: "flex", flexDirection: "column" },
  media: { height: 500, objectFit: "cover" },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
};

interface MovieCardProps {
  movie: DiscoverMovieOverviewProps;
  actions?: ReactNode;
}

const MovieCard = ({ movie, actions }: MovieCardProps) => {
  return (
    <Box
      sx={{
        display: "block",
        height: "100%",
      }}
    >
      <Card sx={styles.card}>
      <CardHeader
        avatar={
          movie.favourite ? (
            <Avatar sx={styles.avatar}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        title={
          <Typography 
            variant="h5" 
            component="p"
            sx={{
              minHeight: "2.8em",
              maxHeight: "2.8em",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical"
            }}
          >
            {movie.title}{" "}
          </Typography>
        }
      />

      <Box
        component={RouterLink}
        to={`/movies/${movie.id}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          },
          transition: "all 0.3s ease",
        }}
      >
        <CardMedia
          sx={styles.media}
          image={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
              : img
          }
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <CalendarIcon fontSize="small" />
              {movie.release_date}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" component="p">
              <StarRateIcon fontSize="small" />
              {"  "} {movie.vote_average}{" "}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {actions && (
        <CardActions disableSpacing>
          {actions}
        </CardActions>
      )}
    </Card>
    </Box>
  );
}

export default MovieCard;
