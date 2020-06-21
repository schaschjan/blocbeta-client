import React, {
    Fragment,
    useContext,
    useRef,
    useState,
    useEffect,
} from "react";
import {Link, useLocation} from "react-router-dom";
import "./Header.css";
import Button from "../Button/Button";
import {AppContext, getLocationSlug} from "../../App";
import useApi, {api, cacheKeys} from "../../hooks/useApi";
import {useHistory} from "react-router-dom";
import HyperLink from "../HyperLink/HyperLink";
import {useMediaQuery} from "react-responsive/src";
import Icon from "../Icon/Icon";
import useClickOutside from "../../hooks/useClickOutside";
import useKeyDown from "../../hooks/useKeyDown";
import Modal from "../Modal/Modal";
import {alphaSort, largeQuery} from "../../helpers";
import classnames from "classnames";
import {motion} from "framer-motion"

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
        redirect(location.url)
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
                <div className='locations'>
                    <ul className="location-list">
                        {alphaSort(locations, "name").map((location) => {

                            const isCurrent = currentLocation.id === location.id;

                            return (
                                <motion.li whileHover={!isCurrent ? {x: 4} : null} key={location.id}
                                           className={classnames('location-list__item', isCurrent ? 'location-list__item--active' : null)}
                                           onMouseEnter={() => setFocusedLocation(location)}
                                           onMouseLeave={() => setFocusedLocation(location)}
                                           onClick={() => switchLocation(location)}>
                                    {location.name}
                                    <span className='geo'>[{location.city}, {location.countryCode}]</span>
                                </motion.li>
                            );
                        })}s
                    </ul>

                    <div className="location-info">
                        <div className='location-info__image' style={{backgroundImage: `url(${focusedLocation.image})`}}/>

                        <div className={'location-info__address'}>
                            <address>
                                {focusedLocation.addressLineOne} <br/>

                                {focusedLocation.addressLineTwo && (
                                    <Fragment>{focusedLocation.addressLineTwo} <br/></Fragment>
                                )}
                                {focusedLocation.zip} {focusedLocation.city} <br/>
                            </address>
                        </div>

                        <ul className="location-info__social">
                            {focusedLocation.website && (
                                <li>
                                    <a href={focusedLocation.website}>{focusedLocation.website}</a>
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

const Header = () => {
    const {user, authenticated, reset, locationPath, isAdmin} = useContext(
        AppContext
    );

    let history = useHistory();
    const {pathname} = useLocation();

    useEffect(() => {
        closeOffCanvas();
    }, [pathname]);

    const closeOffCanvas = () => {
        setOffCanvasOpen(false);
    };

    const openOffCanvas = () => {
        setOffCanvasOpen(true);
    };

    const logout = (event) => {
        closeOffCanvas();
        reset();
        history.push("/login");
    };

    const isLarge = useMediaQuery(largeQuery);
    const [offCanvasOpen, setOffCanvasOpen] = useState(false);

    const offCanvasRef = useRef();

    useClickOutside(offCanvasRef, () => closeOffCanvas());
    useKeyDown("Escape", () => closeOffCanvas());

    const Navigation = () => {
        return (
            <ul className="navigation">
                <li>
                    <Link to={locationPath("/boulder?ascent=todo")}>Boulder</Link>
                </li>
                <li>
                    <Link to={locationPath("/ranking/current")}>Ranking</Link>
                </li>
                <li>
                    <Link to={locationPath("/account")}>[{user.username}]</Link>
                </li>
                {isAdmin && (
                    <li>
                        <Link to={locationPath("/settings")}>Settings</Link>
                    </li>
                )}
                <li>
                    <Button onClick={(event) => logout(event)}>Logout</Button>
                </li>
            </ul>
        );
    };

    if (!authenticated() || !getLocationSlug()) {
        return (
            <header className="header">
                <ul>
                    <li>
                        <Link to="/login" className="logo">
                            BlocBeta
                        </Link>
                    </li>
                </ul>
            </header>
        );
    }

    return (
        <header className="header">
            <div className="location-switch">
                <Link to={locationPath("/dashboard")} className="logo">
                    BlocBeta @
                </Link>
                <LocationSwitch/>
            </div>

            {isLarge ? (
                <Navigation/>
            ) : (
                <Fragment>
                    {offCanvasOpen ? (
                        <Icon name="close-large" onClick={() => closeOffCanvas()}/>
                    ) : (
                        <Icon name="burger" onClick={() => openOffCanvas()}/>
                    )}

                    <motion.div
                        ref={offCanvasRef}
                        className={classnames(
                            "offcanvas-navigation",
                            offCanvasOpen ? "offcanvas-navigation--open" : null
                        )}
                        positionTransition
                    >
                        <Navigation/>
                    </motion.div>
                </Fragment>
            )}
        </header>
    );
};

export default Header;
