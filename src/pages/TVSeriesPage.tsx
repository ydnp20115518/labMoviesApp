import { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import TVSeriesCard from "../components/TVSeriesCard";
import useTVSeriesQuery from "../hooks/useTVSeriesQuery";
import PaginationControls from "../components/PaginationControls";

const TVSeriesPage = () => {
  const [page, setPage] = useState(1);
  const { data: series = [] } = useTVSeriesQuery(page);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Popular TV Series
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Discover the most popular TV series right now
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {series.map((s) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={s.id}>
            <TVSeriesCard series={s} />
          </Grid>
        ))}
      </Grid>

      <PaginationControls page={page} onPageChange={setPage} />
    </Container>
  );
};

export default TVSeriesPage;
