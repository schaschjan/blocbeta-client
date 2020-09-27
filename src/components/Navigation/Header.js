import React, {
  Fragment,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import "./Header.css";
import Button from "../Button/Button";
import {AppContext} from "../../App";
import useApi, {api, cacheKeys} from "../../hooks/useApi";
import {Link, NavLink, useHistory} from "react-router-dom";
import HyperLink from "../HyperLink/HyperLink";
import {useMediaQuery} from "react-responsive/src";
import Icon from "../Icon/Icon";
import useClickOutside from "../../hooks/useClickOutside";
import useKeyDown from "../../hooks/useKeyDown";
import Modal from "../Modal/Modal";
import {alphaSort, largeQuery} from "../../helpers";
import classnames from "classnames";
import {motion} from "framer-motion";

const LocationSwitch = () => {
  const {status, data: locations} = useApi(
    cacheKeys.locations,
    api.locations.public
  );

  const {currentLocation, setCurrentLocation} = useContext(AppContext);
  const modalContentRef = useRef();

  const [modalOpen, setModalOpen] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState(currentLocation);

  const switchLocation = (location) => {
    setCurrentLocation(location);
    redirect(location.url);
  };

  useEffect(() => {
    setFocusedLocation(currentLocation);
  }, [currentLocation]);

  useKeyDown("Escape", () => setModalOpen(false));
  useClickOutside(modalContentRef, () => {
    setModalOpen(setModalOpen(false));
  });

  const redirect = (slug) => {
    window.location.pathname = `/${slug}/dashboard`;
  };

  if (status === "loading") return null;

  return (
    <Fragment>
      <Modal open={modalOpen} contentRef={modalContentRef}>
        <div className="locations">
          <ul className="location-list">
            {alphaSort(locations, "name").map((location) => {
              const isCurrent = currentLocation.id === location.id;

              return (
                <motion.li
                  whileHover={!isCurrent ? {x: 4} : null}
                  key={location.id}
                  className={classnames(
                    "location-list__item",
                    isCurrent ? "location-list__item--active" : null
                  )}
                  onMouseEnter={() => setFocusedLocation(location)}
                  onMouseLeave={() => setFocusedLocation(location)}
                  onClick={() => switchLocation(location)}
                >
                  {location.name}
                  <span className="geo">
                    [{location.city}, {location.countryCode}]
                  </span>
                </motion.li>
              );
            })}
            s
          </ul>

          <div className="location-info">
            <div
              className="location-info__image"
              style={{backgroundImage: `url(${focusedLocation.image})`}}
            />

            <div className={"location-info__address"}>
              <address>
                {focusedLocation.addressLineOne} <br/>
                {focusedLocation.addressLineTwo && (
                  <Fragment>
                    {focusedLocation.addressLineTwo} <br/>
                  </Fragment>
                )}
                {focusedLocation.zip} {focusedLocation.city} <br/>
              </address>
            </div>

            <ul className="location-info__social">
              {focusedLocation.website && (
                <li>
                  <a href={focusedLocation.website}>
                    {focusedLocation.website}
                  </a>
                </li>
              )}

              {focusedLocation.twitter && (
                <li>
                  <a href={focusedLocation.website}>Twitter</a>
                </li>
              )}

              {focusedLocation.facebook && (
                <li>
                  <a href={focusedLocation.facebook}>Facebook</a>
                </li>
              )}

              {focusedLocation.instagram && (
                <li>
                  <a href={focusedLocation.instagram}>Instagram</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Modal>

      <HyperLink onClick={() => setModalOpen(true)}>
        {currentLocation && currentLocation.name}
      </HyperLink>
    </Fragment>
  );
};

const NavItem = ({link, children}) => {
  return (
    <NavLink to={link} className="header-nav__item" activeClassName="header-nav__item--active">
      {children}
    </NavLink>
  )
};

const Header = () => {
  const {user, contextualizedPath, reset, currentLocation} = useContext(AppContext);

  if (!currentLocation) {
    return (
      <header className="header">
        <Link className="header__logo" to="/login">BlocBeta</Link>
      </header>
    )
  }

  return (
    <header className="header">
      <NavLink className="header__logo" to={contextualizedPath("/dashboard")}>BlocBeta</NavLink>

      <nav className="header__nav header-nav">
        <NavItem link={contextualizedPath("/boulder")}>
          Boulder
        </NavItem>
        <NavItem link={contextualizedPath("/ranking")}>
          Ranking
        </NavItem>

        <NavItem link={contextualizedPath("/account")}>
          [{user.username}]
        </NavItem>

        <a href={"http://schedule.blocbeta.com/schedule"} className="header-nav__item">
          Schedule
        </a>

        <span onClick={() => reset()} className="header-nav__item">
          Out!
        </span>
      </nav>
    </header>
  )
};

// const Header = () => {
//   const {
//     user,
//     authenticated,
//     currentLocation,
//     reset,
//     locationPath,
//     isAdmin,
//   } = useContext(AppContext);
//
//   let history = useHistory();
//   const {pathname} = useLocation();
//
//   useEffect(() => {
//     closeOffCanvas();
//   }, [pathname]);
//
//   const closeOffCanvas = () => {
//     setOffCanvasOpen(false);
//   };
//
//   const openOffCanvas = () => {
//     setOffCanvasOpen(true);
//   };
//
//   const logout = (event) => {
//     closeOffCanvas();
//     reset();
//     history.push("/login");
//   };
//
//   const isLarge = useMediaQuery(largeQuery);
//   const [offCanvasOpen, setOffCanvasOpen] = useState(false);
//
//   const offCanvasRef = useRef();
//
//   useClickOutside(offCanvasRef, () => closeOffCanvas());
//   useKeyDown("Escape", () => closeOffCanvas());
//
//   const Navigation = () => {
//     return (
//       <ul className="navigation">
//         <li>
//           <Link to={locationPath("/boulder?ascent=todo")}>Boulder</Link>
//         </li>
//
//         {user.visible && (
//           <li>
//             <Link to={locationPath("/ranking/current")}>Ranking</Link>
//           </li>
//         )}
//
//         <li>
//           <Link to={locationPath("/account")}>[{user.username}]</Link>
//         </li>
//
//         {isAdmin && (
//           <li>
//             <Link to={locationPath("/settings")}>Settings</Link>
//           </li>
//         )}
//
//         <li>
//           <Button onClick={(event) => logout(event)}>Logout</Button>
//         </li>
//       </ul>
//     );
//   };
//
//   if (!authenticated() || !getLocationSlug() || !currentLocation) {
//     return (
//       <header className="header">
//         <ul>
//           <li>
//             <Link to="/login" className="header__logo">
//               BlocBeta
//             </Link>
//           </li>
//         </ul>
//       </header>
//     );
//   }
//
//   return (
//     <header className="header">
//       <Link to={locationPath("/dashboard")} className="header__logo">
//         BlocBeta @
//       </Link>
//       <LocationSwitch/>
//
//       {isLarge ? (
//         <Navigation/>
//       ) : (
//         <Fragment>
//           {offCanvasOpen ? (
//             <Icon name="close-large" onClick={() => closeOffCanvas()}/>
//           ) : (
//             <Icon name="burger" onClick={() => openOffCanvas()}/>
//           )}
//
//           <motion.div
//             ref={offCanvasRef}
//             className={classnames(
//               "offcanvas-navigation",
//               offCanvasOpen ? "offcanvas-navigation--open" : null
//             )}
//             positionTransition
//           >
//             <Navigation/>
//           </motion.div>
//         </Fragment>
//       )}
//     </header>
//   );
// };

export default Header;
