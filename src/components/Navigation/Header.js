import React, {Fragment, useContext, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import "./Header.css";
import Button from "../Button/Button";
import {AppContext} from "../../App";
import useApi, {api} from "../../hooks/useApi";
import {useHistory} from "react-router-dom";
import HyperLink from "../HyperLink/HyperLink";
import {useMediaQuery} from "react-responsive/src";
import Icon from "../Icon/Icon";
import {motion} from "framer-motion";
import classnames from "classnames";
import useClickOutside from "../../hooks/useClickOutside";
import useKeyDown from "../../hooks/useKeyDown";
import {largeQuery} from "../../Helpers";

const LocationSwitch = () => {
    const {status} = useApi('locations', api.locations.public);
    const {currentLocation} = useContext(AppContext);

    if (status === 'loading') return null;

    return <HyperLink>{currentLocation.name}</HyperLink>
};

const Header = () => {
    const {user, authenticated, reset, locationPath, isAdmin} = useContext(AppContext);
    let history = useHistory();

    const isLarge = useMediaQuery(largeQuery);
    const [offCanvasOpen, setOffCanvasOpen] = useState(false);

    const offCanvasRef = useRef();
    useClickOutside(offCanvasRef, () => closeOffCanvas());
    useKeyDown('Escape', () => closeOffCanvas());

    const closeOffCanvas = () => {
        setOffCanvasOpen(false)
    };

    const openOffCanvas = () => {
        setOffCanvasOpen(true)
    };

    const logout = (event) => {
        closeOffCanvas();
        reset();
        history.push('/login');
    };

    const Navigation = () => {
        const linkProps = {
            onClick: () => closeOffCanvas()
        };

        return (
            <ul className="navigation">
                <li>
                    <Link to={locationPath('/boulder')} {...linkProps}>Boulder</Link>
                </li>
                <li>
                    <Link to={locationPath('/ranking/current')} {...linkProps}>Ranking</Link>
                </li>
                <li>
                    <Link to={'/account'} {...linkProps}>[{user.username}]</Link>
                </li>
                {isAdmin && (
                    <li>
                        <Link to={locationPath('/settings')} {...linkProps}>Settings</Link>
                    </li>
                )}
                <li>
                    <Button onClick={(event) => logout(event)}>Logout</Button>
                </li>
            </ul>
        )
    };

    if (!authenticated()) {
        return (
            <header className="header">
                <ul>
                    <li>
                        <Link to='/login' className="logo">
                            BlocBeta
                        </Link>
                    </li>
                </ul>
            </header>
        )
    }

    return (
        <header className="header">
            <div className="location-switch">
                <Link to={locationPath('/dashboard')} className="logo">BlocBeta @</Link>
                <LocationSwitch/>
            </div>

            {isLarge ? (
                <Navigation/>
            ) : (
                <Fragment>
                    {offCanvasOpen ? (
                        <Icon name="close-large" onClick={() => closeOffCanvas()}/>
                    ) : (
                        <Icon name="menu" onClick={() => openOffCanvas()}/>
                    )}

                    <motion.div
                        ref={offCanvasRef}
                        className={classnames('offcanvas-navigation', offCanvasOpen ? 'offcanvas-navigation--open' : null)}
                        positionTransition>
                        <Navigation/>
                    </motion.div>
                </Fragment>
            )}
        </header>
    )
};

export default Header