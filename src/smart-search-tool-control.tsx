import * as React from "react";
import Paper from "@mui/material/Paper";
// import InputBase from "@mui/material/InputBase";
// import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { UserContext } from "./user-context-store";
import { GetGroups } from "./smart-search-service";
import AutocompleteHighlights from "./autocomplete-highlights";

// eslint-disable-next-line import/prefer-default-export
export function SmartSearchToolControl() {
  const [groups, setGroups] = React.useState("");
  const [groupSelected, setGroupSelected] = React.useState("37");
  const { accountId, userId } = React.useContext(UserContext);

  const handleChange = (event: SelectChangeEvent) => {
    setGroupSelected(event.target.value);
  };
  React.useEffect(() => {
    async function fetchGroupsData() {
      const response = await GetGroups(accountId, userId);
      setGroups(response.SwoopData);
    }
    fetchGroupsData();
  }, [accountId, userId]);

  return (
    <Paper
      component="form"
      sx={{ p: 0, display: "flex", alignItems: "center", width: "100%", marginBottom: 2, marginTop: 2 }}
    >
      {/* <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton> */}
      <FormControl
        variant="filled"
        sx={{
          // TODO search for a responsive measure
          minWidth: "150px",
          //   "& .css-vobkx7-MuiInputBase-root-MuiFilledInput-root-MuiSelect-root": {
          //     minWidth: "150px",
          //   },
          "& .css-llrb4p-MuiInputBase-root-MuiFilledInput-root-MuiSelect-root:before": {
            border: "none",
          },
          "& .css-llrb4p-MuiInputBase-root-MuiFilledInput-root-MuiSelect-root": {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          },
        }}
      >
        <InputLabel
          id="demo-simple-select-filled-label"
        >
          Groups
        </InputLabel>
        <Select
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={groupSelected}
          onChange={handleChange}
        >
          {Object.entries(groups).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Test Group 1</MenuItem>
          <MenuItem value={20}>243546</MenuItem>
          <MenuItem value={30}>Group Test 2</MenuItem> */}
        </Select>
      </FormControl>
      <AutocompleteHighlights groupSelected={groupSelected} />
      {/* <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search by group, address details, phone number, location number, reference code etc."
        inputProps={{ "aria-label": "Search by group, address details, phone number, location number, reference code etc." }}
      /> */}
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
    </Paper>
  );
}
