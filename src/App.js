import React, {createContext, useContext, Fragment} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {router} from "./router";
import {Footer} from "./components/Footer/Footer";
import {Helmet} from "react-helmet";
import {NavItem, Header} from "./index"
import {BlocBetaUI, BlocBetaUIContext} from "./components/BlocBetaUI";
import {useQuery} from 'react-query'
import ScrollToTop from "./components/ScrollToTop";
import {ToastContainer} from "./components/Toaster/Toaster";
import {queryDefaults, useApi} from "./hooks/useApi";
import {cache} from "./helper/api";

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

const Routing = () => {
  const {isAuthenticated, contextualizedPath} = useContext(BlocBetaUIContext);

  const PrivateRoute = ({children, ...rest}) => {

    return (
      <Route
        {...rest}
        render={() => {
          if (isAuthenticated) {
            return children
          }

          return <Redirect to={{pathname: "/login"}}/>
        }}
      />
    );
  };

  return <Switch>
    <Route path="/" exact>
      {isAuthenticated ? (
        <Redirect to={contextualizedPath("/dashboard")}/>
      ) : (
        <Redirect to="/login"/>
      )}
    </Route>

    {router.map((route, index) => {

      if (!route.public) {
        return <PrivateRoute
          key={index}
          path={route.path}
          exact={route.exact}
          children={
            <Fragment>
              <route.main/>
            </Fragment>
          }
        />

      } else {

        return <Route
          key={index}
          path={route.path}
          exact={route.exact}
          children={<route.main/>}
        />
      }
    })}
  </Switch>
};

const ReservationNavItem = () => {
  const {contextualizedPath} = useContext(BlocBetaUIContext);

  const {status, data} = useQuery(cache.reservationCount, useApi("reservationCount"), queryDefaults);

  return (
    <NavItem to={contextualizedPath("/reservations")}>
      Reservations ({status === "loading" ? 0 : data})
    </NavItem>
  )
};

const AppHeader = () => {
  const {contextualizedPath, user, isAdmin} = useContext(BlocBetaUIContext);

  const {data: locations} = useQuery(cache.locations, useApi("locations"), queryDefaults);

  return <Fragment>

    <Header
      locations={locations}
      locationSwitchTargetPath={"/dashboard"}
      logoLink={contextualizedPath("/dashboard")}>

      {isAdmin && (
        <NavItem to={contextualizedPath("/boulder")}>
          Boulder
        </NavItem>
      )}

      {user && user.visible && isAdmin && (
        <NavItem to={contextualizedPath("/ranking/current")}>
          Ranking
        </NavItem>
      )}

      <NavItem to={contextualizedPath("/schedule")}>
        Schedule
      </NavItem>

      <ReservationNavItem/>

      <NavItem to={contextualizedPath("/account")}>
        [{user && user.username}]
      </NavItem>

    </Header>
  </Fragment>
};

const App = () => {

  return (
    <Fragment>
      <Router>
        <ScrollToTop/>
        <BlocBetaUI>
          <ToastContainer>
            <div className="app">
              <AppHeader/>

              <div className="content">
                <Routing/>
              </div>

              <Footer/>
            </div>
          </ToastContainer>
        </BlocBetaUI>
      </Router>
    </Fragment>
  );
};

export default App;
