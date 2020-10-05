import React, {useContext, useState} from 'react'
import {Link, NavLink} from 'react-router-dom'
import {useHistory} from "react-router-dom"
import './Header.css'
import {BlocBetaUIContext} from "../BlocBetaUI";
import {buildClassNames, Burger, Close} from "../../index";

export default ({children, locationSwitchTargetPath, locations, logoLink}) => {
  const {reset, setCurrentLocation, currentLocation} = useContext(BlocBetaUIContext);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const history = useHistory();

  const switchLocation = (locationId) => {
    const newLocation = locations.find(location => location.id === parseInt(locationId));

    if (!newLocation) {
      return
    }

    setCurrentLocation(newLocation);

    history.push(`/${newLocation.url}${locationSwitchTargetPath}`);
  };

  if (!currentLocation) {
    return (
      <header className="header">
        <Link className="header__logo" to="/login">BlocBeta</Link>
      </header>
    )
  }

  return (
    <header className="header">
      <NavLink className="header__logo header-logo" to={logoLink}>
        BlocBeta

        <select className="header-logo__location-select location-select t--eta"
                onChange={(event) => switchLocation(event.target.value)}>

          <option value=""> @{currentLocation.name}</option>

          {locations && locations.map(location => {
            if (parseInt(location.id) === currentLocation.id) {
              return null
            }

            return <option value={location.id} key={location.id}>
              @{location.name}
            </option>
          })}
        </select>
      </NavLink>

      <nav className={buildClassNames("header__nav header-nav", mobileNavOpen ? "header-nav--open" : null)}
           onClick={() => setMobileNavOpen(false)}>
        {children}

        <span onClick={() => reset()} className="header-nav__item">
          Out!
        </span>
      </nav>

      <div className="header__mobile-toggle" onClick={() => setMobileNavOpen(!mobileNavOpen)}>
        {mobileNavOpen ? <Close/> : <Burger/>}
      </div>
    </header>
  )
};
