import { DashboardUser } from "./session-types";
import { createContext } from 'react';

declare var $: any;
declare const dashboardUserDataInState: DashboardUser;
// export const dashboardUserDataInStateReact: DashboardUser = {
//   accountId: process.env.REACT_APP_TEST_ACCOUNT_ID ?? dashboardUserDataInState.accountId,
//   userGroupId: Number(process.env.REACT_APP_TEST_GROUP_ID) ?? Number(dashboardUserDataInState.userGroupId),
//   userId: process.env.REACT_APP_TEST_USER_ID ?? dashboardUserDataInState.userId,
//   userName: process.env.REACT_APP_TEST_USERNAME ?? dashboardUserDataInState.userName,
//   resellerId: process.env.REACT_APP_TEST_RESELLER_ID ?? dashboardUserDataInState.resellerId,
//   impersonator: process.env.REACT_APP_TEST_USERNAME ?? dashboardUserDataInState.impersonator,
//   isUser: process.env.REACT_APP_TEST_IS_USER ?? dashboardUserDataInState.isUser,
//   connectionId: process.env.REACT_APP_TEST_CONNECTION_ID ?? dashboardUserDataInState.connectionId,
//   userEmail: process.env.REACT_APP_TEST_USER_EMAIL ?? dashboardUserDataInState.userEmail,
//   impersonatorEmail: process.env.REACT_APP_TEST_IMPERSONATOR_EMAIL ?? dashboardUserDataInState.impersonatorEmail,
//   impersonatorName: process.env.REACT_APP_TEST_IMPERSONATOR_NAME ?? dashboardUserDataInState.impersonatorName,
//   hasReviewAccess: process.env.REACT_APP_TEST_REVIEW_ACCESS ?? dashboardUserDataInState.hasReviewAccess,
//   enableLocationEdit: process.env.REACT_APP_TEST_LOCATION_EDIT ?? dashboardUserDataInState.enableLocationEdit,
// };

export function getDashboardUser() {
  return dashboardUserDataInState;
}
// declare const dashboardUserDataInState:DashboardUser;
export const UserContext = createContext<DashboardUser>({ ...dashboardUserDataInState });
