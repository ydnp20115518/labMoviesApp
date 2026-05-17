import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

import { TVSeriesOverviewProps } from "../types/movieAppTypes";

const imageUrl = "https://image.tmdb.org/t/p/w342";

interface TVSeriesCardProps {
  series: TVSeriesOverviewProps;
}

const TVSeriesCard = ({ series }: TVSeriesCardProps) => {
  return (
    <Card sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="400"
        image={
          series.poster_path
            ? `${imageUrl}${series.poster_path}`
            : "https://via.placeholder.com/342x400?text=No+Image"
        }
        alt={series.name}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant="h5" component="div" noWrap>
          {series.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          First aired: {series.first_air_date}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Rating: {series.vote_average.toFixed(1)}/10
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ height: "2.5em", overflow: "hidden" }}>
          {series.overview}
        </Typography>
      </CardContent>
      <CardActions>
        <Link
          component={RouterLink}
          to={`/tv-series/${series.id}`}
          sx={{ cursor: "pointer" }}
        >
          View Details
        </Link>
      </CardActions>
    </Card>
  );
};

export default TVSeriesCard;
