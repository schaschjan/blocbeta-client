import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BoulderDBUIContext } from "../BoulderDBUI";
import { useLocation } from "react-router-dom";
import { Close } from "../Icon/Close";
import { cache, queryDefaults, useApi } from "../../hooks/useApi";
import { useQuery } from "react-query";
import { classNames } from "../../helper/classNames";
import Burger from "../Icon/Burger";
import { NavItem } from "../NavItem/NavItem";
import useRequest from "../../hooks/useRequest";
import "./Header.css";

const DoubtCountItem = () => {
  const { contextualizedPath } = useContext(BoulderDBUIContext);
  const { data } = useRequest(`/doubt/count`);

  return (
    <NavItem to={contextualizedPath("/doubts")}>
      Doubts ({data ? data : 0})
    </NavItem>
  );
};

const Header = () => {
  const {
    contextualizedPath,
    user,
    isAdmin,
    reset,
    setCurrentLocation,
    currentLocation,
    isAuthenticated,
  } = useContext(BoulderDBUIContext);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const { data: locations } = useQuery(
    cache.locations,
    useApi("locations"),
    queryDefaults
  );

  const switchLocation = (locationId) => {
    const newLocation = locations.find(
      (location) => location.id === parseInt(locationId)
    );

    if (!newLocation) {
      return;
    }

    const oldLocation = currentLocation;

    setCurrentLocation(newLocation);
    history.push(location.pathname.replace(oldLocation.url, newLocation.url));
  };

  if (!currentLocation) {
    return (
      <header className="header">
        <Link className="header__logo" to="/login">
          BoulderDB
        </Link>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header__logo header-logo">
        <Link
          to={contextualizedPath("/boulder")}
          className="header-logo__title t--eta"
        >
          BoulderDB
        </Link>

        <select
          className="header-logo__location-select location-select t--eta"
          onChange={(event) => switchLocation(event.target.value)}
        >
          <option value=""> @{currentLocation.name}</option>

          {locations &&
            locations.map((location) => {
              if (parseInt(location.id) === currentLocation.id) {
                return null;
              }

              return (
                <option value={location.id} key={location.id}>
                  @{location.name}
                </option>
              );
            })}
        </select>
      </div>

      <nav
        className={classNames(
          "header__nav header-nav",
          mobileNavOpen ? "header-nav--open" : null
        )}
        onClick={() => setMobileNavOpen(false)}
      >
        <NavItem to={contextualizedPath("/boulder")}>Boulder</NavItem>

        <NavItem to={contextualizedPath("/ranking/current")}>Ranking</NavItem>

        <NavItem to={contextualizedPath("/account")}>
          [{user && user.username}]
        </NavItem>

        {isAuthenticated && currentLocation && <DoubtCountItem />}

        {isAdmin && <NavItem to={contextualizedPath("/admin")}>Admin</NavItem>}

        <span onClick={() => reset()} className="header-nav__item">
          Out!
        </span>
      </nav>

      <div
        className="header__mobile-toggle"
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        {mobileNavOpen ? <Close /> : <Burger />}
      </div>
    </header>
  );
};

export { Header };
