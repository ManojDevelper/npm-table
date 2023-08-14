import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Box, CircularProgress, StyledEngineProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserContext, getDashboardUser } from "./user-context-store";
// eslint-disable-next-line import/no-unresolved
import { SmartSearchToolControl } from "./smart-search-tool-control";
// import initI18n from "../lang";

function SmartSearchTool() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: false,
        staleTime: 60 * 1000, // 1 minutes
      },
    },
  });
  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <Suspense
          fallback={(
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          )}
        >
          <QueryClientProvider client={queryClient}>
            <UserContext.Provider value={getDashboardUser()}>
              <SmartSearchToolControl />
            </UserContext.Provider>
          </QueryClientProvider>
        </Suspense>
      </StyledEngineProvider>
    </React.StrictMode>
    // <React.StrictMode>
    //   <SmartSearchToolControl />
    // </React.StrictMode>
  );
}

const container = document.getElementById("smartSearchToolPkg");
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(<SmartSearchTool />);
}
