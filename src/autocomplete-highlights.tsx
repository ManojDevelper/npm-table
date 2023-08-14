import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@mui/material/TextField";
import { isStringEmpty } from "./helpers";
import { GetCountryStatesCitiesNew, GetGroups, locationAutocomplete } from "./smart-search-service";
import { styled } from "@mui/material";
import { UserContext } from "./user-context-store";
// darken, lighten,
// import { smartSearchService } from "@dashboard/shared/services";
// import { useQuery } from "react-query";
// import { ApiError } from "@dashboard/shared/types";

// const GroupHeader = styled("div")(({ theme }) => ({
//   // position: "sticky",
//   top: "-8px",
//   padding: "4px 10px",
//   color: theme.palette.primary.main,
//   backgroundColor:
//     theme.palette.mode === "light"
//       ? lighten(theme.palette.primary.light, 0.85)
//       : darken(theme.palette.primary.main, 0.8),
// }));

const GroupItems = styled("ul")({
  padding: 0,
});

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

interface AutocompleteProps {
  groupSelected: string;
}

interface TargetString {
  description: string;
  grouping: string;
}

export default function AutocompleteHighlights(props: AutocompleteProps) {
  const { groupSelected } = props;
  // const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<any[]>([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [displayingGroups, setDisplayingGroups] = React.useState<number>(0);
  const [groupsTotalRecords, setGroupsTotalRecords] = React.useState<number>(0);
  const [groupingBkgColor, setGroupingBkgColor] = React.useState<any[]>([]);
  const [swoopGroups, setSwoopGroups] = React.useState({});
  const [countriesFromApi, setCountriesFromApi] = React.useState({ Countries: [] });

  interface GroupingDataProps {
    totalRecords: number;
    showing: number,
  }

  // const [searchCountriesTotalCount, setSearchCountriesTotalCount] = React.useState<number>(0);
  // const [searchCitiesTotalCount] = React.useState<any[]>([]);
  const [searchLocationsTotalCount, setSearchLocationsTotalCount] = React.useState<GroupingDataProps>(
    { totalRecords: 0, showing: 0 },
  );
  // const [searchGroupsTotalCount] = React.useState<GroupingDataProps>(
  //   { totalRecords: 0, showing: 0 },
  // );
  // const loading = open && options.length === 0;
  const { accountId, defaultGroupId, userCountry, userId } = React.useContext(UserContext);

  React.useEffect(() => {
    async function getCountriesApi() {
      const responseCountries = await GetCountryStatesCitiesNew(accountId, defaultGroupId, "all");
      return responseCountries;
    }
    async function fetchCountriesData() {
      try {
        const countriesData = await getCountriesApi();
        setCountriesFromApi(countriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchCountriesData();
  }, [accountId, defaultGroupId]);

  React.useEffect(() => {
    async function getGroupsFromApi() {
      const responseGroups = await GetGroups(accountId, userId);
      return responseGroups.SwoopData;
    }
    async function fetchGroupsData() {
      try {
        const groupsData = await getGroupsFromApi();
        setSwoopGroups(groupsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchGroupsData();
  }, [accountId, userId]);

  const groupingCitiesCount: Set<any> = new Set([]);
  const groupingRegionsCount: Set<any> = new Set([]);
  const groupingCountriesCount: Set<any> = new Set([]);

  function extractKeyByString(data: any, targetString: TargetString): number | null {
    const key = Object.keys(data).find((key) => data[key].includes(targetString.description));
    return key !== undefined ? Number(key) : null;
  }

  // function getGroupsTotalCount(data: any): number {
  //   const totalCount = Object.keys(data).length;
  //   return totalCount !== undefined ? Number(totalCount) : 0;
  // }

  function getRegionCode(data: any, countryRefId: number, regionRefId: number) {
    if (!Array.isArray(data)) {
      return null; // Data is not an array
    }

    const country = data.find((c: any) => c?.CountryRefId === countryRefId);

    if (!country || !Array.isArray(country.Regions)) {
      return null; // Country not found or Regions is not an array
    }

    const region = country.Regions.find((r: any) => r?.RegionRefId === regionRefId);

    if (!region || isStringEmpty(region.RegionCode)) {
      return ""; // Region not found or RegionCode is empty
    }

    return ` - ${region.RegionCode}`;
  }

  function searchInArrayOfObjects(array: any, searchTerm: string) {
    const matchingObjects = array.filter((obj: any) => {
      const value = Object.values(obj)[1];
      return value.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return matchingObjects;
  }

  async function handleSearchChange(e: any) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    setOptions([]);
    if (e.target.value.trim() !== "") {
      const response = await locationAutocomplete(
        accountId,
        Number(groupSelected),
        e.target.value,
        userCountry,
        true,
        true,
        false,
      );
      const cityRefIdSet = new Set();
      const regionRefIdSet = new Set();
      const countryRefIdSet = new Set();

      if (response) {
        cityRefIdSet.clear();
        regionRefIdSet.clear();
        countryRefIdSet.clear();
        setDisplayingGroups(0);
        setGroupsTotalRecords(0);

        let dataToState:any = [];
        const locationData: any = [];
        const cityData: any = [];
        const regionData: any = [];
        const countryData: any = [];
        const groups: any = [];
        const groupsData: any = [];

        Object.entries(swoopGroups).map(([key, value]) => (
          groups.push({
            key,
            value,
          })
        ));

        const resultFilteredGroups = searchInArrayOfObjects(groups, e.target.value);

        console.log({ swoopGroups, groups, resultFilteredGroups });

        resultFilteredGroups.map(async (group: any, index: number) => {
          const groupItem = {
            description: group.value,
            grouping: "Groups",
          };
          if (index < 10) {
            groupsData.push(groupItem);
          }
        });

        setDisplayingGroups(groupsData.length);
        setGroupsTotalRecords(resultFilteredGroups.length);

        response.Items.map((item: any) => {
          if (countryRefIdSet.has(item.CountryRefId) === false) {
            countryData.push({
            // title: item.BusinessName,
              description: item.Country,
              countryRefId: item.CountryRefId,
              grouping: "Country",
            });
            countryRefIdSet.add(item.CountryRefId);
          }
          if (regionRefIdSet.has(item.RegionRefId) === false) {
            regionData.push({
            // title: item.BusinessName,
              description: `${item.Region} ${getRegionCode(countriesFromApi.Countries, Number(item.CountryRefId), Number(item.RegionRefId))}`,
              regionRefId: item.RegionRefId,
              grouping: "Region",
            });
            regionRefIdSet.add(item.RegionRefId);
          }
          if (cityRefIdSet.has(item.CityRefId) === false) {
            cityData.push({
              // title: item.BusinessName,
              description: item.City,
              cityRefId: item.CityRefId,
              grouping: "Cities",
            });
            cityRefIdSet.add(item.CityRefId);
          }
          locationData.push({
            // title: item.BusinessName,
            description: `${item.LocationNumber}
            ${"<br/>"}
            ${item.AccountLocationId !== "" ? `Reference Code: ${item.AccountLocationId} ${"<br/>"}` : ""}
            ${item.BusinessName} 
            ${"<br/>"} 
            ${item.AddressLine1}
            ${"<br/>"}
            ${item.City} ${" "} ${item.Region} ${" "} ${item.PostalCode} 
            ${"<br/>"}
            ${item.FormattedTelephone}
            `,
            locationRefId: item.LocationRefId,
            grouping: "Locations",
          });
        });
        console.log({ groupsData, countryData, regionData });
        // if (groupsData.length > 0);
        setGroupingBkgColor([]);
        setGroupingBkgColor([groupsData.length > 0 && { Groups: "" }, countryData.length > 0 && { Country: "" }, regionData.length > 0 && { Region: "" }, cityData.length > 0 && { City: "" }, locationData.length > 0 && { Location: "" }]);
        // if (countryData.length > 0) setGroupingBkgColor([...groupingBkgColor, ]);
        // if (regionData.length > 0) setGroupingBkgColor([...groupingBkgColor, { Region: "" }]);
        // if (cityData.length > 0) setGroupingBkgColor([...groupingBkgColor, { City: "" }]);
        // if (locationData.length > 0) setGroupingBkgColor([...groupingBkgColor, { Location: "" }]);

        console.log({ groupingBkgColor });

        setSearchLocationsTotalCount({
          totalRecords: response.RecordCount,
          showing: response.Items.length,
        });
        dataToState = [...groupsData, ...countryData, ...regionData, ...cityData, ...locationData];
        setOptions(dataToState.map((option: any) => {
          // const firstLetter = option.title[0].toUpperCase();
          const { grouping } = option;
          return {
            // firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
            grouping,
            ...option,
          };
        }));
      }
    }
  }

  // async function handleOpen() {
  //   console.log({ open });
  //   await sleep(5000); // For demo purposes.
  //   setOpen(open);
  //   console.log({ open });
  // }

  // React.useEffect(() => {
  //   let active = true;

  //   if (!loading) {
  //     return undefined;
  //   }

  //   (async () => {
  //     await sleep(1e3); // For demo purposes.

  //     if (active) {
  //       // eslint-disable-next-line no-use-before-define
  //       setOptions([...top100Films]);
  //     }
  //   })();

  //   return () => {
  //     active = false;
  //   };
  // }, [loading]);

  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions(options);
  //   }
  // }, [open, options]);

  const convertToBR = (str: string) => {
    const splitString = str.split("<br/>");
    return splitString.map((text: string, index: number) => (
      <React.Fragment key={index}>
        {text}
        {index < splitString.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const extarctRefId = (str: string) => {
    const splitString = str.split("<br/>");
    if (str.includes("<br/>")) {
      return splitString[0].trim();
    }
    return splitString[0];
  };

  // function getItemsBkgColor(group: string) {
  //   let backgroundColor = "";
  //   switch (group) {
  //     case "Country":
  //       backgroundColor = "orange";
  //       break;
  //     case "Region":
  //       backgroundColor = "pink";
  //       break;
  //     case "Cities":
  //       backgroundColor = "green";
  //       break;
  //     case "Locations":
  //       backgroundColor = "yellow";
  //       break;
  //     case "Groups":
  //       backgroundColor = "brown";
  //       break;
  //     default:
  //       backgroundColor = "grey";
  //       break;
  //   }
  //   return backgroundColor;
  // }

  function setGroupingHeader(group: string) {
    let groupToDisplay = "";
    switch (group) {
      case "Country":
        groupToDisplay = `${group}`;
        break;
      case "Region":
        groupToDisplay = `${group}`;
        break;
      case "Cities":
        groupToDisplay = `${group}`;
        break;
      case "Locations":
        groupToDisplay = `${group}`;
        break;
      case "Groups":
        groupToDisplay = `${group}`;
        break;
      default:
        groupToDisplay = group;
        break;
    }
    return groupToDisplay;
  }

  function setGroupingSubHeader(group: string) {
    let groupToDisplay = "";
    switch (group) {
      case "Country":
        groupToDisplay = `${groupingCountriesCount.size}${"/"}${groupingCountriesCount.size}`;
        break;
      case "Region":
        groupToDisplay = `${groupingRegionsCount.size}${"/"}${groupingRegionsCount.size}`;
        break;
      case "Cities":
        groupToDisplay = `${groupingCitiesCount.size}${"/"}${groupingCitiesCount.size}`;
        break;
      case "Locations":
        groupToDisplay = `${searchLocationsTotalCount.showing}${"/"}${searchLocationsTotalCount.totalRecords}`;
        break;
      case "Groups":
        groupToDisplay = `${displayingGroups}${"/"}${groupsTotalRecords}`;
        break;
      default:
        groupToDisplay = group;
        break;
    }
    return groupToDisplay;
  }

  // const handleUpdateCitiesState = (option: any) => {
  //   setSearchCitiesTotalCount([...searchCitiesTotalCount, option]);
  //   return false;
  // };

  return (
    <Autocomplete
      inputValue={searchValue}
      id="highlights-demo"
      fullWidth
      clearOnEscape
      clearOnBlur
      sx={{
        paddingLeft: 2,
        // "& .MuiFormControl-root.MuiTextField-root:hover": {
        //   border: "none",
        //   background: "yellow",
        // },
        "& .MuiAutocomplete-popupIndicator": {
          display: "none",
        },
        "& .MuiInputBase-root.MuiInput-root:before": {
          border: "none",
        },
        "& .MuiInputBase-root.MuiInput-root:hover": {
          border: "none",
        },
      }}
      placeholder="Search by group, address details, phone number, location number, reference code etc."
      groupBy={(option) => {
        if (option.grouping === "Cities") groupingCitiesCount.add(option);
        if (option.grouping === "Region") groupingRegionsCount.add(option);
        if (option.grouping === "Country") groupingCountriesCount.add(option);
        return option.grouping;
      }}
      options={options} // .sort((a, b) => -b.grouping.localeCompare(a.grouping))
      getOptionLabel={(option) => option.description}
      onChange={(_event, newValue) => {
        console.log({ newValue });
        if (newValue?.grouping && newValue.grouping === "Groups") newValue.groupRefId = extractKeyByString(swoopGroups && swoopGroups, newValue);
      }}
      onInputChange={(_event, newInputValue) => {
        setSearchValue(`${extarctRefId(newInputValue)}`);
        if (newInputValue.trim() === "") {
          setOptions([]);
        }
      }}
    //   open={open}
    //   onOpen={
    //     () => {
    //     // setOpen(true);
    //       handleOpen();
    //     }
    // }
    //   onClose={() => {
    //     // setOpen(false);
    //     handleOpen();
    //   }}
    //   isOptionEqualToValue={(option, value) => option.title === value.title}
    //   loading={open}
      renderInput={(params) => (
        <TextField
          variant="standard"
          {...params}
          // InputProps={{
          //   ...params.InputProps,
          //   endAdornment: (
          //     <>
          //       {loading ? <CircularProgress color="inherit" size={20} /> : null}
          //       {params.InputProps.endAdornment}
          //     </>
          //   ),
          // }}
          placeholder="Search by group, address details, phone number, location number, reference code etc."
          margin="normal"
          sx={{
            border: "none",
          }}
          onChange={(e) => handleSearchChange(e)}
          // onFocus={(e) => console.log(e.target.value)}
        />
      )}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.description, inputValue, { insideWords: true });
        const parts = parse(option.description, matches);
        return (
          <li {...props} style={{ borderBottom: "1px solid #e1dede", background: "#f7f3f3", color: "#4A4A4A", minHeight: "50px" }}>
            <div>
              {parts.map((part: any, index: number) => (
                <span
                  key={index}
                  style={{
                    fontWeight: part.highlight ? 700 : 400,
                  }}
                >
                  {/* {part.text} */}
                  {convertToBR(part.text)}
                  {/* {option.description} */}
                </span>
              ))}
            </div>
          </li>
        );
      }}
      renderGroup={(params) => (
        <li key={params.key}>
          {/* <GroupHeader>{`${setGroupingHeader(params.group)}`}</GroupHeader> */}
          <div style={{ display: "flex" }}>
            <div style={{ background: "rgba(0, 159, 255, 0.3)", width: "120px", padding: "5px 13px", fontSize: "13px", color: "#4A4A4A", fontWeight: "bold" }}>
              <span>{`${setGroupingHeader(params.group)}`}</span>
              <br />
              {`${setGroupingSubHeader(params.group)}`}
            </div>
            <div style={{ width: "100%", fontSize: "13px", marginLeft: "-30px" }}><GroupItems>{params.children}</GroupItems></div>
          </div>
        </li>
      )}
    />
  );
}
