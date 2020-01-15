import React from 'react';
import {Link} from "react-router-dom";
import {getPath} from "../Helpers";
import Context from "../Context";

const redirectLocation = (event) => {

    const currentLocation = window.location.slug;
    const changeLocation = event.target.value;

    window.location.pathname = window.location.pathname.replace(currentLocation, changeLocation);
};

const LocationSelect = () => {
    return (
        <select onChange={redirectLocation}>
            {Object.values(window.locations).map(location => {

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

export default function Header() {

    return (
        <header className="header">
            <ul>
                <li>
                    <Link to={getPath('/admin')}>
                        <strong>BlocBeta</strong> @ <LocationSelect/>
                    </Link>
                </li>
            </ul>

            <ul>
                <li>
                    <Link to={getPath('/admin/boulder')}>Boulder</Link>
                </li>
                <li>
                    <Link to={getPath('/admin/events')}>Events</Link>
                </li>
                <li>
                    <Link to={getPath('/admin/users')}>Users</Link>
                </li>
                <li>
                    <Link to={getPath('/admin/errors')}>
                        Errors <span className="color-error">({window.errors})</span>
                    </Link>
                </li>
                <li>
                    <Link to={getPath('/admin/settings')}>Settings</Link>
                </li>
            </ul>
        </header>
    )
}