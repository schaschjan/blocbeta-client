import Login from "../views/Login/Login";
import Register from "../views/Register";
import PasswordReset from "../views/PasswordReset";
import Dashboard from "../views/Dashboard";
import BoulderIndex from "../views/Boulder/Index/Index";
import BoulderAdd from "../views/Boulder/Add/Add";
import BoulderEdit from "../views/Boulder/Edit/Edit";
import CurrentRanking from "../views/Ranking/Current/Current";
import CurrentComparison from "../views/Compare/Current";
import Account from "../views/Account";
import React from "react";
import Settings from "../views/Settings/Settings";

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
        path: "/reset-password",
        render: () => <PasswordReset/>,
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
        exact: true
    },
    {
        title: "Add Boulder",
        path: "/:locationSlug/boulder/add",
        render: () => <BoulderAdd/>,
        exact: true,
        admin: true
    },
    {
        title: "Edit Boulder",
        path: "/:locationSlug/boulder/:boulderId",
        render: () => <BoulderEdit/>,
        exact: true,
        admin: true
    },
    {
        title: "Current Ranking",
        path: "/:locationSlug/ranking/current",
        render: () => <CurrentRanking/>,
        exact: true
    },
    {
        title: "Compare current",
        path: "/:locationSlug/compare/:a/to/:b/at/current",
        render: () => <CurrentComparison/>,
        exact: true
    },
    {
        title: "Account",
        path: "/account",
        render: () => <Account/>,
        exact: true
    },
    {
        title: "Settings",
        path: "/:locationSlug/settings",
        render: () => <Settings/>,
        exact: true,
        admin: true
    }
];