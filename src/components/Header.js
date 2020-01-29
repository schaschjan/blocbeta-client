import React, {useState, useEffect} from 'react';
import {Link, withRouter} from "react-router-dom";
import Context from "../Context";
import db from "../db";

const LocationSelect = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        db.locations.toArray().then(locations => {
            setLocations(locations)
        });
    }, []);

    if (!locations) {
        return null;
    }

    return (
        <select>
            {locations.map(location => {

                if (!location.public) {
                    return null
                }

                if (location.url === Context.getLocationUrl()) {
                    return <option selected value={location.url}>{location.name}</option>
                } else {
                    return <option value={location.url}>{location.name}</option>
                }
            })}
        </select>
    )
};

const Header = ({authenticated, history}) => {

    const handleLogout = (event) => {
        event.preventDefault();

        Context.logout();
        Context.destroy();

        history.push('/login');
        authenticated = false;
    };


    if (!authenticated) {
        return (
            <header className="header">
                <ul>
                    <li>
                        <Link to={'/login'}>
                            <strong>BlocBeta</strong>
                        </Link>
                    </li>
                </ul>
            </header>
        )
    }

    return (
        <header className="header">
            <ul>
                <li>
                    <Link to={Context.getPath('/dashboard')}>
                        <strong>BlocBeta</strong> @ <LocationSelect/>
                    </Link>
                </li>
            </ul>

            <ul>
                <li>
                    <Link to={Context.getPath('/boulder')}>Boulder</Link>
                </li>
                <li>
                    <Link to={Context.getPath('/ranking')}>Ranking</Link>
                </li>
                <li>
                    <Link to={Context.getPath('/me')}>[{Context.getUsername()}]</Link>
                </li>
                <li>
                    <a href='#' onClick={(event) => handleLogout(event)}>Leave!</a>
                </li>
            </ul>
        </header>
    )
};

export default withRouter(Header)