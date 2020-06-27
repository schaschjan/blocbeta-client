import Login from "./views/Login/Login";
import Register from "./views/Register/Register";
import RequestPasswordReset from "./views/RequestPasswordReset/RequestPasswordReset";
import Dashboard from "./views/Dashboard/Dashboard";
import BoulderIndex from "./views/Boulder/Index/Index";
import BoulderAdd from "./views/Boulder/Add/Add";
import BoulderEdit from "./views/Boulder/Edit/Edit";
import CurrentRanking from "./views/Ranking/Current/Current";
import CurrentComparison from "./views/Compare/Current";
import Account from "./views/Account/Account";
import React from "react";
import Settings from "./views/Settings/Settings";
import AllTime from "./views/Ranking/AllTime/AllTime";
import ResetPassword from "./views/ResetPassword/ResetPassword";

export const router = [
    {
        title: "Login",
        path: "/login",
        render: () => <Login/>,
        exact: true,
        public: true,
    },
    {
        title: "Register",
        path: "/register",
        render: () => <Register/>,
        exact: true,
        public: true,
    },
    {
        title: "Reset Password",
        path: "/password-reset/request",
        render: () => <RequestPasswordReset/>,
        exact: true,
        public: true,
    },
    {
        title: "Reset Password",
        path: "/password-reset/:hash",
        render: () => <ResetPassword/>,
        exact: true,
        public: true,
    },
    {
        title: "Dashboard",
        path: "/:locationSlug/dashboard",
        render: () => <Dashboard/>,
        exact: true,
    },
    {
        title: "Boulder index",
        path: "/:locationSlug/boulder",
        render: () => <BoulderIndex/>,
        exact: true,
    },
    {
        title: "Add boulder",
        path: "/:locationSlug/boulder/add",
        render: () => <BoulderAdd/>,
        exact: true,
        admin: true,
    },
    {
        title: "Edit boulder",
        path: "/:locationSlug/boulder/:boulderId",
        render: () => <BoulderEdit/>,
        exact: true,
        admin: true,
    },
    {
        title: "Current ranking",
        path: "/:locationSlug/ranking/current",
        render: () => <CurrentRanking/>,
        exact: true,
        visibleOnly: true
    },
    {
        title: "All time ranking",
        path: "/:locationSlug/ranking/all-time",
        render: () => <AllTime/>,
        exact: true,
        visibleOnly: true
    },
    {
        title: "Compare current",
        path: "/:locationSlug/compare/:a/to/:b/at/current",
        render: () => <CurrentComparison/>,
        exact: true,
        visibleOnly: true
    },
    {
        title: "Account",
        path: "/:locationSlug/account",
        render: () => <Account/>,
        exact: true,
    },
    {
        title: "Settings",
        path: "/:locationSlug/settings",
        render: () => <Settings/>,
        exact: true,
        admin: true,
    },
];
