import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Context from "./Context";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import Header from "./components/Header";
import BoulderIndex from "./views/boulder/Index.js";
import CurrentRanking from "./views/ranking/Current";
import CurrentComparison from "./views/compare/Current";
import Account from "./views/Account";
import {ToastContainer} from "react-toastify";

const LoginRedirect = () => (
    <Redirect
        to={{
            pathname: "/login"
        }}
    />
);

const PrivateRoute = ({children, ...rest}) => {
    if (Context.isAuthenticated()) {
        return <Route {...rest}/>
    }

    return (
        <Route
            {...rest}
            render={() =>
                Context.isAuthenticated() ? (children) : <LoginRedirect/>
            }
        />
    );
};

const App = () => {

    const [authenticated, setAuthenticated] = useState(Context.isAuthenticated);

    function handleSuccess(data) {
        setAuthenticated(true);

        return <Redirect to={{pathname: `/${Context.getLocationUrl()}/dashboard`}}/>;
    }

    const routes = [
        {
            title: "Login",
            path: "/login",
            render: () => <Login onAuthenticationSuccess={handleSuccess}/>,
            public: true,
            exact: true,
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

    return (
        <Router>
            <div className="app">
                <Header authenticated={authenticated}/>

                <div className="content">
                    <Switch>
                        {routes.map((route, i) => {
                            if (route.public) {
                                return <Route key={i} {...route} />
                            }

                            return <PrivateRoute key={i} {...route} />
                        })}

                        <Route render={() => <LoginRedirect/>}/>
                    </Switch>
                </div>

                <ToastContainer/>
            </div>
        </Router>
    );
};

export default App