import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import RequestPasswordReset from "./views/RequestPasswordReset/RequestPasswordReset";
import Dashboard from "./views/Dashboard/Dashboard";
import Account from "./views/Account/Account";
import React from "react";
import NotFound from "./views/NotFound/NotFound";
import ResetPassword from "./views/ResetPassword/ResetPassword";
import Setup from "./views/Setup/Setup";
import AccessDenied from "./views/AccessDenied/AccessDenied";
import CurrentRanking from "./views/Ranking/Current/Current";

export const router = [
  {
    title: "Login",
    path: "/login",
    public: true,
    exact: true,
    redirectAuthenticated: true,
    main: () => <Login/>,
  },
  {
    title: "Register",
    path: "/register",
    public: true,
    exact: true,
    redirectAuthenticated: true,
    main: () => <Register/>,
  },
  {
    title: "Setup",
    path: "/setup",
    exact: true,
    redirectAuthenticated: true,
    main: () => <Setup/>,
  },
  {
    title: "Request Password Reset",
    path: "/password-reset/request",
    public: true,
    exact: true,
    redirectAuthenticated: true,
    main: () => <RequestPasswordReset/>,
  },
  {
    title: "Reset Password",
    path: "/password-reset/:hash",
    public: true,
    redirectAuthenticated: true,
    main: () => <ResetPassword/>,
  },
  {
    title: "Dashboard",
    path: "/:location/dashboard",
    exact: true,
    main: () => <Dashboard/>,
  },
  {
    title: "Account",
    path: "/:location/account",
    exact: true,
    main: () => <Account/>,
  },
  {
    title: "Access Denied",
    path: "/access-denied",
    main: () => <AccessDenied/>,
  },
  {
    title: "Current ranking",
    path: "/:location/ranking/current",
    main: () => <CurrentRanking/>,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "Not Found",
    path: "*",
    main: () => <NotFound/>,
  },

  // {
  //   title: "Boulder index",
  //   path: "/:location/boulder",
  //   main: () => <BoulderIndex/>,
  //   exact: true,
  // },
  // {
  //   title: "Add boulder",
  //   path: "/:location/boulder/add",
  //   main: () => <BoulderAdd/>,
  //   exact: true,
  //   admin: true,
  // },
  // {
  //   title: "Edit boulder",
  //   path: "/:location/boulder/:boulderId",
  //   render: () => <BoulderEdit/>,
  //   exact: true,
  //   admin: true,
  // },
  // {
  //   title: "Current ranking",
  //   path: "/:location/ranking/current",
  //   render: () => <CurrentRanking/>,
  //   exact: true,
  //   visibleUserOnly: true,
  // },
  // {
  //   title: "All time ranking",
  //   path: "/:location/ranking/all-time",
  //   render: () => <AllTime/>,
  //   exact: true,
  //   visibleUserOnly: true,
  // },
  // {
  //   title: "Compare current",
  //   path: "/:location/compare/:a/to/:b/at/current",
  //   render: () => <CurrentComparison/>,
  //   exact: true,
  //   visibleUserOnly: true,
  // },
  // {
  //   title: "Settings",
  //   path: "/:location/settings",
  //   render: () => <Settings/>,
  //   exact: true,
  //   admin: true,
  // }
];
