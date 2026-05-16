import { useState } from "react";
import { Container, Grid, Box, Typography, Button, Stack } from "@mui/material";
import TVSeriesCard from "../components/TVSeriesCard";
import useTVSeriesQuery from "../hooks/useTVSeriesQuery";

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

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          variant="contained"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
          <Typography>Page {page}</Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </Stack>
    </Container>
  );
};

export default TVSeriesPage;
