import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import { ActorOverviewProps } from "../types/movieAppTypes";

const imageUrl = "https://image.tmdb.org/t/p/w342";

interface ActorCardProps {
  actor: ActorOverviewProps;
}

const ActorCard = ({ actor }: ActorCardProps) => {
  return (
    <Card sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="400"
        image={
          actor.profile_path
            ? `${imageUrl}${actor.profile_path}`
            : "https://via.placeholder.com/342x400?text=No+Image"
        }
        alt={actor.name}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {actor.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {actor.known_for_department}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Popularity: {actor.popularity.toFixed(1)}
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          component={RouterLink}
          to={`/actors/${actor.id}`}
          sx={{ cursor: "pointer" }}
        >
          View Details
        </Link>
      </CardActions>
    </Card>
  );
};

export default ActorCard;
