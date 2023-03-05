import { Pagination, Grid } from "@mui/material";
import { Stack } from "@mui/system";

function PaginationControls({ totalPages, onPageChange, currentPage }) {
  function handleChange(event, value) {
    onPageChange(value);
  }

  const currentPageNumber = currentPage || 1;
  return (
    <Grid container justifyContent="center">
      <Stack spacing={2}>
        <Pagination
          showFirstButton
          showLastButton
          size="large"
          variant="outlined"
          color="primary"
          count={totalPages}
          page={currentPageNumber}
          onChange={handleChange}
        />
      </Stack>
    </Grid>
  );
}

export default PaginationControls;
