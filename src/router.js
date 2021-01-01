import React from "react";
import { Index as AccessDenied } from "./views/AccessDenied/Index";
import { Index as Ticker } from "./views/Ticker/Index";
import { Index as BlockerIndex } from "./views/Blocker/Index";
import { Add as BlockerAdd } from "./views/Blocker/Add";
import { Index as RoomIndex } from "./views/Room/Index";
import { Detail as RoomDetail } from "./views/Room/Detail";
import { Index as SetterIndex } from "./views/Setter/Index";
import { Index as NotFound } from "./views/NotFound/Index";
import { Add as SetterAdd } from "./views/Setter/Add";
import { Add as BoulderAdd } from "./views/Boulder/Add";
import { Add as ReservationAdd } from "./views/Reservation/Add";
import { Index as Login } from "./views/Login/Index";
import { Index as Setup } from "./views/Setup/Index";
import { Index as Register } from "./views/Register/Index";
import { Index as Schedule } from "./views/Schedule/Index";
import { Index as Reservations } from "./views/Reservations/Index";
import { Cancel } from "./views/Reservations/Cancel";
import { Request } from "./views/PasswordReset/Request";
import { Reset } from "./views/PasswordReset/Reset";
import { Index as Account } from "./views/Account/Index";
import { Index as Admin } from "./views/Admin/Index";
import { Index as BoulderIndex } from "./views/Boulder/Index";
import { Current as CurrentRanking } from "./views/Ranking/Current";
import { Current as CompareCurrent } from "./views/Compare/Current";
import { AllTime as AllTimeRanking } from "./views/Ranking/AllTime";

const adminRoutes = [
  {
    title: "Schedule overview",
    path: "/:location/admin",
    exact: true,
    admin: true,
    main: () => <Admin />,
  },
  {
    title: "Schedule overview",
    path: "/:location/admin/schedule-ticker",
    exact: true,
    admin: true,
    main: () => <Ticker />,
  },
  {
    title: "Time slot blockers",
    path: "/:location/admin/time-slot-blocker",
    exact: true,
    admin: true,
    main: () => <BlockerIndex />,
  },
  {
    title: "Add time slot blocker",
    path: "/:location/admin/time-slot-blocker/add",
    exact: true,
    admin: true,
    main: () => <BlockerAdd />,
  },
  {
    title: "List rooms",
    path: "/:location/admin/rooms",
    exact: true,
    admin: true,
    main: () => <RoomIndex />,
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
    title: "Room Detail",
    path: "/:location/admin/rooms/:room",
    admin: true,
    main: () => <RoomDetail />,
  },
  {
    title: "Add Guest Reservation",
    path: "/:location/admin/reservations/add-guest",
    admin: true,
    main: () => <ReservationAdd />,
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
    title: "Schedule",
    id: "schedule",
    path: "/:location/schedule",
    exact: true,
    main: () => <Schedule />,
  },
  {
    title: "Reservations",
    id: "reservations",
    path: "/:location/reservations",
    exact: true,
    main: () => <Reservations />,
  },
  {
    title: "Cancel reservation",
    id: "cancelReservation",
    path: "/cancel-reservation/:hash",
    public: true,
    main: () => <Cancel />,
  },
  {
    title: "Access Denied",
    path: "/access-denied",
    main: () => <AccessDenied />,
  },
  {
    title: "Not Found",
    path: "*",
    main: () => <NotFound />,
  },
];
