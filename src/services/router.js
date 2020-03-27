import Login from "../views/Login/Login";
import Register from "../views/Register";
import PasswordReset from "../views/PasswordReset";
import Dashboard from "../views/Dashboard";
import BoulderIndex from "../views/boulder/Index/Index";
import BoulderAdd from "../views/boulder/Add/Add";
import BoulderEdit from "../views/boulder/Edit/Edit";
import CurrentRanking from "../views/ranking/Current";
import CurrentComparison from "../views/compare/Current";
import Account from "../views/Account";
import React from "react";

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
        title: "Add boulder",
        path: "/:locationSlug/boulder/add",
        render: () => <BoulderAdd/>,
        exact: true,
        admin: true
    },
    {
        title: "Edit boulder",
        path: "/:locationSlug/boulder/:boulderId",
        render: () => <BoulderEdit/>,
        exact: true,
        admin: true
    },
    {
        title: "Current ranking",
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
    }
];