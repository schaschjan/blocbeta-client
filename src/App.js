import React, { createContext, useContext, Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { router } from "./router";
import { Footer } from "./components/Footer/Footer";
import { Helmet } from "react-helmet";
import { BoulderDBUI, BoulderDBUIContext } from "./components/BoulderDBUI";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "./components/Toaster/Toaster";
import { DrawerContainer } from "./components/Drawer/Drawer";
import { Header } from "./components/Header/Header";

export const Meta = ({ title, description }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>Blocbeta - {title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );
};

export const AppContext = createContext({});

const Routing = () => {
  const { isAuthenticated, contextualizedPath } = useContext(
    BoulderDBUIContext
  );

  const PrivateRoute = ({ children, ...rest }) => {
    return (
      <Route
        {...rest}
        render={() => {
          if (isAuthenticated) {
            return children;
          }

          return <Redirect to={{ pathname: "/login" }} />;
        }}
      />
    );
  };

  return (
    <Switch>
      <Route path="/" exact>
        {isAuthenticated ? (
          <Redirect to={contextualizedPath("/boulder")} />
        ) : (
          <Redirect to="/login" />
        )}
      </Route>

      {router.map((route, index) => {
        if (!route.public) {
          return (
            <PrivateRoute
              key={index}
              path={route.path}
              exact={route.exact}
              children={
                <Fragment>
                  <Header />
                  <route.main />
                </Fragment>
              }
            />
          );
        } else {
          return (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={
                <Fragment>
                  <Header />
                  <route.main />
                </Fragment>
              }
            />
          );
        }
      })}
    </Switch>
  );
};

const App = () => {
  return (
    <Fragment>
      <Router>
        <ScrollToTop />
        <BoulderDBUI>
          <DrawerContainer>
            <ToastContainer>
              <div className="app">
                <div className="content">
                  <Routing />
                </div>

                <Footer />
              </div>
            </ToastContainer>
          </DrawerContainer>
        </BoulderDBUI>
      </Router>
    </Fragment>
  );
};

export default App;
