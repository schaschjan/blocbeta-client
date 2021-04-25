import React, { useContext, useCallback, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BoulderDBUIContext } from "../BoulderDBUI";
import { useLocation } from "react-router-dom";
import { Close } from "../Icon/Close";
import { classNames, joinClassNames } from "../../helper/classNames";
import Burger from "../Icon/Burger";
import { useRequest } from "../../hooks/useRequest";
import styles from "./Header.module.css";
import typography from "../../css/typography.module.css";

const NavItem = ({ children, ...rest }) => {
  return (
    <NavLink
      className={styles.navItem}
      activeClassName={styles.isActiveNavItem}
      {...rest}
    >
      {children}
    </NavLink>
  );
};

const DoubtCountNavItem = () => {
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

  const { data: locations } = useRequest("/location", false);

  const switchLocation = useCallback(
    (locationId) => {
      const newLocation = locations.find(
        (location) => location.id === parseInt(locationId)
      );

      if (!newLocation) {
        return;
      }

      const oldLocation = currentLocation;

      setCurrentLocation(newLocation);
      history.push(location.pathname.replace(oldLocation.url, newLocation.url));
    },
    [locations]
  );

  if (!currentLocation) {
    return (
      <header className={styles.root}>
        <Link className={styles.logo} to="/login">
          BoulderDB
        </Link>
      </header>
    );
  }

  return (
    <header className={joinClassNames(styles.root, typography.eta)}>
      <div className={styles.logo}>
        <Link
          to={contextualizedPath("/boulder")}
          className={joinClassNames(styles.title)}
        >
          BoulderDB
        </Link>

        <select
          className={joinClassNames(styles.locationSelect, typography.eta)}
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
          styles.nav,
          mobileNavOpen ? styles.isOpenMobileNav : null
        )}
        onClick={() => setMobileNavOpen(false)}
      >
        <NavItem to={contextualizedPath("/boulder")}>Boulder</NavItem>

        {user && user.visible && (
          <NavItem to={contextualizedPath("/ranking/current")}>Ranking</NavItem>
        )}

        <NavItem to={contextualizedPath("/account")}>
          [{user && user.username}]
        </NavItem>

        {isAuthenticated && currentLocation && <DoubtCountNavItem />}

        {isAdmin && <NavItem to={contextualizedPath("/admin")}>Admin</NavItem>}

        <span onClick={() => reset()} className={styles.navItem}>
          Out!
        </span>
      </nav>

      <div
        className={styles.toggle}
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
      >
        {mobileNavOpen ? <Close /> : <Burger />}
      </div>
    </header>
  );
};

export { Header };
