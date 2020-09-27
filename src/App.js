import React, {createContext, Fragment, useMemo, useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "./components/Navigation/Header";
import {router} from "./router";
import {Footer} from "./components/Footer/Footer";
import usePersistentState from "./hooks/usePersistentState";
import {Helmet} from "react-helmet";
import classNames from "classnames";

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

const App = () => {
  const [user, setUser] = usePersistentState("user", null);
  const [currentLocation, setCurrentLocation] = usePersistentState("location", null);
  const [expiration, setExpiration] = usePersistentState("expiration", null);

  const [contentDisabled, disableContent] = useState(false);
  const [appClassName, setAppClassName] = useState(null);

  const contextualizedPath = (path) => {
    return `/${currentLocation.url}${path}`
  };

  const reset = () => {
    setUser(null);
    setCurrentLocation(null);
    setExpiration(null);

    localStorage.clear();
  };

  const authenticated = () => {
    if (!user) {
      return false
    }

    return new Date().getTime() / 1000 <= expiration;
  };

  const isAdmin = useMemo(() => {
    if (!currentLocation) {
      return false;
    }

    return user.roles.includes(
      `ROLE_ADMIN@${currentLocation.id}`
    );
  }, []);

  const appContextValues = {
    user,
    setUser,
    currentLocation,
    setCurrentLocation,
    expiration,
    setExpiration,
    contentDisabled,

    contextualizedPath,
    appClassName,
    setAppClassName,

    disableContent,
    isAdmin,
    authenticated,
    reset,
  };

  const PrivateRoute = ({children, ...rest}) => {
    if (authenticated()) {
      return <Route {...rest} />;
    }

    return (
      <Route
        {...rest}
        render={() => (authenticated() ? children : <LoginRedirect/>)}
      />
    );
  };

  const LoginRedirect = () => {
    return (
      <Redirect
        to={{
          pathname: "/login",
        }}
      />
    );
  };

  const routes = router.filter((route) => {
    if (route.admin === true && !isAdmin) {
      return false;
    }

    return !(route.visibleOnly === true && user && !user.visible);
  });

  return (
    <Fragment>
      <Router>
        <AppContext.Provider value={appContextValues}>
          <div className={classNames("app", `app--${appClassName}`)}>
            <Header/>

            <Switch>
              {routes.map((route, i) => {
                if (!route.public) {
                  return <PrivateRoute key={i} {...route} />;
                }

                return <Route key={i} {...route} />;
              })}

              <Route render={() => <LoginRedirect/>}/>
            </Switch>

            <Footer/>
          </div>
        </AppContext.Provider>
      </Router>

    </Fragment>
  );
};

export default App;
