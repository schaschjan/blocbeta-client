import React from "react";
import { Edit as BoulderDetail } from "./views/Boulder/Edit";
import { Index as SetterIndex } from "./views/Setter/Index";
import { Index as NotFound } from "./views/NotFound/Index";
import { Add as SetterAdd } from "./views/Setter/Add";
import { Add as BoulderAdd } from "./views/Boulder/Add";
import { Index as Login } from "./views/Login/Index";
import { Index as Setup } from "./views/Setup/Index";
import { Index as Register } from "./views/Register/Index";
import { Request } from "./views/PasswordReset/Request";
import { Reset } from "./views/PasswordReset/Reset";
import { Index as Account } from "./views/Account/Index";
import { Index as Admin } from "./views/Admin/Index";
import { Index as BoulderIndex } from "./views/Boulder/Index";
import { Current as CurrentRanking } from "./views/Ranking/Current";
import { Current as CompareCurrent } from "./views/Compare/Current";
import { AllTime as AllTimeRanking } from "./views/Ranking/AllTime";
import { Index as Doubts } from "./views/Doubt/Index";
import { Index as WallIndex } from "./views/Wall/Index";

const adminRoutes = [
  {
    title: "Schedule overview",
    path: "/:location/admin",
    exact: true,
    admin: true,
    main: () => <Admin />,
  },
  {
    title: "List setters",
    path: "/:location/admin/setters",
    exact: true,
    admin: true,
    main: () => <SetterIndex />,
  },
  {
    title: "List setters",
    path: "/:location/admin/setters/add",
    exact: true,
    admin: true,
    main: () => <SetterAdd />,
  },
  {
    title: "Add boulder",
    path: "/:location/admin/boulder/add",
    exact: true,
    admin: true,
    main: () => <BoulderAdd />,
  },
  {
    title: "Edit boulder",
    path: "/:location/admin/boulder/:boulderId",
    exact: true,
    admin: true,
    main: () => <BoulderDetail />,
  },
  {
    title: "List walls",
    path: "/:location/admin/walls",
    exact: true,
    admin: true,
    main: () => <WallIndex />,
  },
];

export const router = [
  ...adminRoutes,
  {
    title: "Login",
    path: "/login",
    public: true,
    exact: true,
    main: () => <Login />,
  },
  {
    title: "Register",
    path: "/register",
    public: true,
    exact: true,
    main: () => <Register />,
  },
  {
    title: "Setup",
    path: "/setup",
    exact: true,
    public: true,
    main: () => <Setup />,
  },
  {
    title: "Request Password Reset",
    path: "/password-reset/request",
    public: true,
    exact: true,
    main: () => <Request />,
  },
  {
    title: "Reset Password",
    path: "/password-reset/:hash",
    public: true,
    main: () => <Reset />,
  },
  {
    title: "Account",
    path: "/:location/account",
    exact: true,
    main: () => <Account />,
  },
  {
    title: "Current ranking",
    path: "/:location/ranking/current",
    main: () => <CurrentRanking />,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "All time ranking",
    path: "/:location/ranking/all-time",
    main: () => <AllTimeRanking />,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "Boulder",
    path: "/:location/boulder",
    main: () => <BoulderIndex />,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "Compare current",
    path: "/:location/compare/:a/to/:b/at/current",
    main: () => <CompareCurrent />,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "Doubts",
    path: "/:location/doubts",
    main: () => <Doubts />,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "Not Found",
    path: "*",
    main: () => <NotFound />,
  },
];
