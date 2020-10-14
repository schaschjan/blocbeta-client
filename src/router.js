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
import Ticker from "./views/Ticker/Ticker";
import Reservations from "./views/Reservations/Reservations";
import CurrentRanking from "./views/CurrentRanking/CurrentRanking";
import CancelReservation from "./views/CancelReservation/CancelReservation";
import AddTimeSlotBlocker from "./views/TimeSlotBlocker/Add";
import IndexTimeSlotBlocker from "./views/TimeSlotBlocker/Index";
import RoomsIndex from "./views/Room/Index";
import RoomsDetail from "./views/Room/Detail";

const adminRoutes = [
  {
    title: "Schedule overview",
    path: "/:location/admin/schedule-ticker",
    exact: true,
    admin: true,
    main: () => <Ticker/>,
  },
  {
    title: "Time slot blockers",
    path: "/:location/admin/time-slot-blocker",
    exact: true,
    admin: true,
    main: () => <IndexTimeSlotBlocker/>,
  },
  {
    title: "Add time slot blocker",
    path: "/:location/admin/time-slot-blocker/add",
    exact: true,
    admin: true,
    main: () => <AddTimeSlotBlocker/>,
  },
  {
    title: "List rooms",
    path: "/:location/admin/rooms",
    exact: true,
    admin: true,
    main: () => <RoomsIndex/>,
  },
  {
    title: "Room Detail",
    path: "/:location/admin/rooms/:room",
    admin: true,
    main: () => <RoomsDetail/>,
  },
];

export const router = [
  ...adminRoutes,
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
    public: true,
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
    title: "Reservations",
    id: "reservations",
    path: "/:location/reservations",
    exact: true,
    main: () => <Reservations/>,
  },
  {
    title: "Cancel reservation",
    id: "cancelReservation",
    path: "/cancel-reservation/:hash",
    public: true,
    main: () => <CancelReservation/>,
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
