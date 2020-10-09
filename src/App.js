import React, {createContext, useContext, Fragment} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {router} from "./router";
import {Footer} from "./components/Footer/Footer";
import {Helmet} from "react-helmet";
import {NavItem, Header} from "./index"
import axios from "axios";
import {BlocBetaUI, BlocBetaUIContext} from "./components/BlocBetaUI";
import {useQuery} from 'react-query'

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
  const {isAuthenticated} = useContext(BlocBetaUIContext);

  const PrivateRoute = ({children, ...rest}) => {

    return (
      <Route
        {...rest}
        render={() => {

          if (isAuthenticated) {
            return children
          }

          return <Redirect to={{pathname: "/login"}}/>
        }
        }
      />
    );
  };

  return <Switch>
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
  const {contextualizedPath, currentLocation} = useContext(BlocBetaUIContext);

  const {status, data} = useQuery("reservations-count", async () => {
    const {data} = await axios.get(`/api/${currentLocation.url}/reservation/pending/count`);

    return data;
  });

  return (
    <NavItem to={contextualizedPath("/reservations")}>
      Reservations ({status === "loading" ? 0 : data})
    </NavItem>
  )
};

const AppHeader = () => {
  const {contextualizedPath, user} = useContext(BlocBetaUIContext);

  const {data: locations} = useQuery("locations", async () => {
    const {data} = await axios.get(`/api/location`);

    return data;
  });

  return <Fragment>

    <Header
      locations={locations}
      locationSwitchTargetPath={"/dashboard"}
      logoLink={contextualizedPath("/dashboard")}>

      {/*{user && user.visible && (*/}
      {/*  <NavItem to={contextualizedPath("/ranking/current")}>*/}
      {/*    Ranking*/}
      {/*  </NavItem>*/}
      {/*)}*/}

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
        <BlocBetaUI>
          <div className="app">
            <AppHeader/>

            <div className="content">
              <Routing/>
            </div>

            <Footer/>
          </div>
        </BlocBetaUI>
      </Router>

      {/*{process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen/>}*/}
    </Fragment>
  );
};

export default App;
