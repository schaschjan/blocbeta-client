import React, {createContext, Fragment, useMemo, useEffect, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
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

export const locationPath = (path) => {
  return window.location.pathname.split("/")[1] + path;
};

export const AppContext = createContext({});

const App = () => {
  const [user, setUser] = usePersistentState("user", null);
  const [currentLocation, setCurrentLocation] = usePersistentState("location", null);
  const [expiration, setExpiration] = usePersistentState("expiration", null);

  const [contentDisabled, disableContent] = useState(false);

  const contextualizedPath = (path) => {
    return `/${currentLocation.url}${path}`
  };

  const authenticated = useMemo(() => {
    if (!user) {
      return false
    }

    return new Date().getTime() / 1000 <= expiration;
  }, [user, expiration]);

  const isAdmin = useMemo(() => {
    if (!currentLocation || !user || !!user.roles) {
      return false;
    }

    return user.roles.includes(
      `ROLE_ADMIN@${currentLocation.id}`
    );
  }, []);

  const scheduleUrl = useMemo(() => {
    let url = new URL(`${process.env.REACT_APP_SCHEDULE_HOST}/login`);

    if (!user || !currentLocation || !expiration) {
      return null
    }

    url.search = new URLSearchParams({
      user: JSON.stringify(user),
      location: JSON.stringify(currentLocation),
      expiration: JSON.stringify(expiration),
    });

    return url.toString();

  }, [user, currentLocation, expiration]);

  useEffect(() => {
    if (!authenticated) {
      setUser(null);
      setCurrentLocation(null);
      setExpiration(null);

      localStorage.clear();
    }

  }, [authenticated]);

  const appContextValues = {
    user,
    setUser,
    currentLocation,
    setCurrentLocation,
    expiration,
    setExpiration,
    contentDisabled,

    contextualizedPath,

    disableContent,
    isAdmin,
    authenticated,

    scheduleUrl
  };

  const PrivateRoute = ({children, ...rest}) => {
    if (authenticated) {
      return <Route {...rest} />;
    }

    return (
      <Route
        {...rest}
        render={() => (authenticated ? children : <LoginRedirect/>)}
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
          <div className={classNames("app")}>
            <Header/>

            <Switch>
              {routes.map((route, i) => {
                if (!route.public) {
                  return <PrivateRoute key={i} {...route} />;
                }

                if (authenticated && route.public && route.redirectAuthenticated && currentLocation) {

                  return <Route key={i} {...route}>
                    <Redirect
                      to={{
                        pathname: contextualizedPath("/dashboard"),
                      }}
                    />
                  </Route>
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
