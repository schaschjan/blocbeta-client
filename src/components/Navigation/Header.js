import React, {useContext} from "react";
import {AppContext} from "../../App";
import {useApiV2} from "../../hooks/useApi";
import {Link, NavLink} from "react-router-dom";
import {useQuery} from "react-query";
import {useHistory} from "react-router-dom";
import "./Header.css";

const NavItem = ({link, children}) => {
  return (
    <NavLink to={link} className="header-nav__item" activeClassName="header-nav__item--active">
      {children}
    </NavLink>
  )
};

const Header = ({children}) => {
  const {
    user,
    contextualizedPath,
    setExpiration,
    isAdmin,
    currentLocation,
    setCurrentLocation,
  } = useContext(AppContext);

  const history = useHistory();

  const {data: locations} = useQuery("locations", useApiV2("locations"));

  const switchLocation = (locationId) => {
    const newLocation = locations.find(location => location.id === parseInt(locationId));

    setCurrentLocation(newLocation);
    history.push(`/${newLocation.url}/dashboard`)
  };

  if (!currentLocation || !user) {
    return (
      <header className="header">
        <Link className="header__logo" to="/login">BlocBeta</Link>
      </header>
    )
  }

  return (
    <header className="header">
      <NavLink className="header__logo header-logo" to={contextualizedPath("/dashboard")}>
        BlocBeta
        <select className="header-logo__location-select location-select t--eta"
                onChange={(event) => switchLocation(event.target.value)}>

          <option value=""> @{currentLocation.name}</option>

          {locations && locations.map(location => {
            if (parseInt(currentLocation.id) === location.id) {
              return null
            }

            return <option value={location.id} key={location.id}>
              @{location.name}
            </option>;
          })}
        </select>
      </NavLink>

      <nav className="header__nav header-nav">
        <NavItem link={contextualizedPath("/ranking/current")}>
          Ranking
        </NavItem>

        <NavItem link={contextualizedPath("/account")}>
          [{user.username}]
        </NavItem>

        {isAdmin && (
          <NavItem className="header-nav__item" link={contextualizedPath("/settings")}>
            Settings
          </NavItem>
        )}

        {children}

        <span onClick={() => setExpiration(null)} className="header-nav__item">
          Out!
        </span>
      </nav>
    </header>
  )
};

export default Header;
