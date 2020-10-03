import React, {createContext, useContext, Fragment} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {router} from "./router";
import {Footer} from "./components/Footer/Footer";
import {Helmet} from "react-helmet";
import {BlocBetaUI, BlocBetaUIContext, Header} from "@blocbeta/ui-core";

export const Meta = ({title, description}) => {
  return (
    <Helmet>
      <meta charSet="utf-8"/>
      <title>Blocbeta - {title}</title>
      <meta name="description" content={description}/>
    </Helmet>
  );
};

export const AppContext = createContext({});

export const locationPath = (path) => {
  return window.location.pathname.split("/")[1] + path;
};

const Routing = () => {
  const {isAuthenticated, isAdmin, user, contextualizedPath} = useContext(BlocBetaUIContext);

  const PrivateRoute = ({children, ...rest}) => {
    if (isAuthenticated) {
      return <Route {...rest} />;
    }

    return (
      <Route
        {...rest}
        render={() => (isAuthenticated ? children : null)}
      />
    );
  };

  return <Switch>
    {router.filter((route) => {
      if (route.admin === true && !isAdmin) {
        return false;
      }

      if (route.visibleUserOnly === true && user && !user.visible) {
        return false
      }

      return true;

    }).map((route, i) => {

      if (!route.public) {
        return <PrivateRoute key={i} {...route} />;
      }

      if (isAuthenticated && route.public && route.redirectAuthenticated) {
        return <Redirect
          to={{
            pathname: contextualizedPath("/dashboard")
          }}/>
      }

      if (!isAuthenticated) {
        return <Redirect
          to={{
            pathname: "/login",
          }}
        />
      }

      return <Route key={i} {...route} />;
    })}
  </Switch>
};

const App = () => {

  return (
    <Fragment>
      <Router>
        <BlocBetaUI>
          <div className="app">
            <Header>

            </Header>

            <Routing/>

            <Footer/>
          </div>
        </BlocBetaUI>
      </Router>

    </Fragment>
  );
};

export default App;
