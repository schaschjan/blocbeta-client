import React, {createContext, useContext, Fragment} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {router} from "./router";
import {Footer} from "./components/Footer/Footer";
import {Helmet} from "react-helmet";
import {BlocBetaUI, BlocBetaUIContext, NavItem, Header} from "@blocbeta/ui-core";
import axios from "axios";
import {useQuery} from "react-query";

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
  const {isAuthenticated, isAdmin} = useContext(BlocBetaUIContext);

  return <Switch>
    {router.map((route, index) => {

      if (!route.public) {

        if (!isAuthenticated) {
          return <Redirect to={{pathname: "/login"}}/>
        }

        if (route.admin && !isAdmin) {
          return <Redirect to={{pathname: "/access-denied"}}/>
        }

        return <Route
          key={index}
          path={route.path}
          exact={route.exact}
          children={<route.main/>}
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

const AppHeader = () => {
  const {contextualizedPath, user} = useContext(BlocBetaUIContext);

  const {data: locations} = useQuery("locations", async () => {
    const {data} = await axios.get(`/api/location`);

    return data;
  });

  return <Header
    locations={locations}
    locationSwitchTargetPath={"/dashboard"}
    logoLink={contextualizedPath("/dashboard")}>

    {user && user.visible && (
      <NavItem to={contextualizedPath("/ranking/current")}>
        Ranking
      </NavItem>
    )}

    <NavItem to={contextualizedPath("/account")}>
      Account
    </NavItem>

    <NavItem to={process.env.REACT_APP_SCHEDULE_HOST} external={true}>
      <mark>Reservation</mark>
    </NavItem>
  </Header>
};

const App = () => {

  return (
    <Fragment>
      <Router>
        <BlocBetaUI>
          <div className="app">
            <AppHeader/>

            <Routing/>

            <Footer/>
          </div>
        </BlocBetaUI>
      </Router>

    </Fragment>
  );
};

export default App;
