import React, {useState, useEffect} from 'react';
import {Link} from "react-router-dom";
import {getPath} from "../Helpers";
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

export default function Header() {

    return (
        <header className="header">
            <ul>
                <li>
                    <Link to={getPath('/dashboard')}>
                        <strong>BlocBeta</strong> @ <LocationSelect/>
                    </Link>
                </li>
            </ul>

            <ul>
                <li>
                    <Link to={getPath('/boulder')}>Boulder</Link>
                </li>
                <li>
                    <Link to={getPath('/ranking')}>Ranking</Link>
                </li>
                <li>
                    <Link to={getPath('/me  ')}>[{Context.getUsername()}]</Link>
                </li>
            </ul>
        </header>
    )
}