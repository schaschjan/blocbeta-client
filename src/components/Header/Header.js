import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import "./Header.css";
import { BlocBetaUIContext } from "../BlocBetaUI";
import { useLocation } from "react-router-dom";
import { Close } from "../Icon/Close";
import { cache, queryDefaults, useApi } from "../../hooks/useApi";
import { useQuery } from "react-query";
import { classNames } from "../../helper/classNames";
import Burger from "../Icon/Burger";
import { NavItem } from "../NavItem/NavItem";

const ReservationCountItem = () => {
  const { contextualizedPath } = useContext(BlocBetaUIContext);

  const { status: reservationCountStatus, data: reservationCount } = useQuery(
    cache.reservationCount,
    useApi("reservationCount"),
    queryDefaults
  );

  return (
    <NavItem to={contextualizedPath("/reservations")}>
      Reservations (
      {reservationCountStatus === "loading" ? 0 : reservationCount})
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
  } = useContext(BlocBetaUIContext);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const { data: locations } = useQuery(
    cache.locations,
    useApi("locations", { location: "poop" }),
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
          BlocBeta
        </Link>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header__logo header-logo">
        <Link
          to={contextualizedPath("/dashboard")}
          className="header-logo__title t--eta"
        >
          BlocBeta
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

        <NavItem to={contextualizedPath("/schedule")}>Schedule</NavItem>

        {isAuthenticated && currentLocation && <ReservationCountItem />}

        <NavItem to={contextualizedPath("/account")}>
          [{user && user.username}]
        </NavItem>

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
