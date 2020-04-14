import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import "./Navigation.css";
import Button from "../Button/Button";
import {AppContext} from "../../App";
import useApi, {api} from "../../hooks/useApi";
import {useHistory} from "react-router-dom";
import HyperLink from "../HyperLink/HyperLink";

const LocationSwitch = () => {
    const {status} = useApi('locations', api.locations.public);
    const {currentLocation} = useContext(AppContext);

    if (status === 'loading') return null;

    return <HyperLink>{currentLocation.name}</HyperLink>
};

const Navigation = () => {
    const {user, authenticated, reset, locationPath, isAdmin} = useContext(AppContext);
    let history = useHistory();

    const logout = (event) => {
        event.preventDefault();
        reset();
        history.push('/login');
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

                {isAdmin && (
                    <Link to={locationPath('/settings')}>Settings</Link>
                )}
            </div>

            <ul className="navigation">
                <li>
                    <Link to={locationPath('/boulder')}>Boulder</Link>
                </li>
                <li>
                    <Link to={locationPath('/ranking/current')}>Ranking</Link>
                </li>
                <li>
                    <Link to={'/account'}>[{user.username}]</Link>
                </li>

                <li>
                    <Button onClick={(event) => logout(event)}>Logout</Button>
                </li>
            </ul>
        </header>
    )
};

export default Navigation