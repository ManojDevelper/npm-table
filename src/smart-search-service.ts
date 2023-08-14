// import { SwoopFeatureOptions } from "@dashboard/shared/types";
import { SwoopFeatureOptions } from "./shared-types";
import { dashboardAsyncApi } from "./http-common";

const locationAutocomplete = async (
  accountId: string,
  defaultGroupId: number,
  search: string,
  userCountry: string,
  showLocationNumber: boolean,
  showClientRef: boolean,
  usePendingChanges: boolean,
) => {
  const response = await dashboardAsyncApi.get(`dashboardasync/LocationAutocomplete?search=${search}&groupId=${defaultGroupId}&pageSize=10&accountId=${accountId}&userCountry=${userCountry}&showLocationNumber=${showLocationNumber}&showClientRef=${showClientRef}&usePendingChanges=${usePendingChanges}`);
  return response.data;
};

const GetCountryStatesCitiesNew = async (
  accountId: string,
  defaultGroupId: number,
  featureOptions: SwoopFeatureOptions | string | null,
) => {
  const response = await dashboardAsyncApi.get(`dashboardasync/GetCountryStatesCitiesNew?accountId=${accountId}&groupId=${defaultGroupId}&usePendingPFOs=${false}`, featureOptions
    ? { headers: { featureOptions: JSON.stringify(featureOptions) } }
    : {});
  return response.data;
};

const GetGroups = async (
  accountId: string,
  userId: string,
) => {
  const response = await dashboardAsyncApi.get(`dashboardasync/GetGroups?accountId=${accountId}&userId=${userId}`);
  return JSON.parse(response.data);
};

// : Promise<CountryRegionCitiesResponse>

// const getReviewMetrics = async (accountId: string, groupId: number, dateFrom: number, dateTo: number) => {
//   const response = await dashboardAsyncApi.get(`dashboardasync/GetReviewsInsightMetricsForLandingPage?accountId=${accountId}&groupId=${groupId}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
//   return response.data;
// };
export {
  locationAutocomplete,
  GetCountryStatesCitiesNew,
  GetGroups
};
