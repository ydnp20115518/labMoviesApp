import { Box, Button, Stack, Typography } from "@mui/material";

interface PaginationControlsProps {
  page: number;
  onPageChange: (page: number) => void;
  maxPages?: number;
}

const PaginationControls = ({ page, onPageChange, maxPages = 500 }: PaginationControlsProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", gap: 3, my: 4 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button
          variant="contained"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        
        <Box sx={{ minWidth: 150, textAlign: "center" }}>
          <Typography variant="body1">
            Page {page} of {maxPages}
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          onClick={() => onPageChange(Math.min(maxPages, page + 1))}
          disabled={page >= maxPages}
        >
          Next
        </Button>
      </Stack>
    </Box>
  );
};

export default PaginationControls;
