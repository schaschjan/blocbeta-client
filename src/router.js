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
import Schedule from "./views/Schedule/Schedule";
import ScheduleOverview from "./views/ScheduleOverview/ScheduleOverview";
import Reservations from "./views/Reservations/Reservations";
import CurrentRanking from "./views/CurrentRanking/CurrentRanking";

export const router = [
  {
    title: "Login",
    path: "/login",
    public: true,
    exact: true,
    main: () => <Login/>,
  },
  {
    title: "Register",
    path: "/register",
    public: true,
    exact: true,
    main: () => <Register/>,
  },
  {
    title: "Setup",
    path: "/setup",
    exact: true,
    main: () => <Setup/>,
  },
  {
    title: "Request Password Reset",
    path: "/password-reset/request",
    public: true,
    exact: true,
    main: () => <RequestPasswordReset/>,
  },
  {
    title: "Reset Password",
    path: "/password-reset/:hash",
    public: true,
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
    title: "Current ranking",
    path: "/:location/ranking/current",
    main: () => <CurrentRanking/>,
    exact: true,
    visibleUserOnly: true,
  },
  {
    title: "Schedule",
    id: "schedule",
    path: "/:location/schedule",
    exact: true,
    main: () => <Schedule/>,
  },
  {
    title: "Schedule overview",
    id: "scheduleOverview",
    path: "/:location/schedule-overview",
    exact: true,
    admin: true,
    main: () => <ScheduleOverview/>,
  },
  {
    title: "Reservations",
    id: "reservations",
    path: "/:location/reservations",
    exact: true,
    main: () => <Reservations/>,
  },
  {
    title: "Access Denied",
    path: "/access-denied",
    main: () => <AccessDenied/>,
  },
  {
    title: "Not Found",
    path: "*",
    main: () => <NotFound/>,
  },
];
