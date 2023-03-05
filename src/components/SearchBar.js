import { Grid, TextField } from "@mui/material";
import { useState } from "react";

function SearchBar({ debounceSearch, allUsers }) {
  const [searchString, setSearchString] = useState("");
  function handleChange(event) {
    const newSearchString = event.target.value;
    setSearchString(newSearchString);
    debounceSearch(newSearchString, allUsers);
  }

  return (
    <Grid container justifyContent="center">
      <TextField
        onChange={handleChange}
        id="input-with-icon-adornment"
        value={searchString}
        label="Search by name email or role"
        variant="outlined"
        fullWidth
      />
    </Grid>
  );
}

export default SearchBar;
