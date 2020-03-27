import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import Context from "../../Context";
import "./Navigation.css";
import Button from "../Button/Button";
import {UserContext} from "../../App";
import {handleLogout} from "../../services/Authentication";

const LocationSwitch = () => {
    const locations = Context.storage.locations.all();

    if (!locations) {
        return null;
    }

    const handleChange = (event) => {
        const selectedLocationId = parseInt(event.target.value);

        if (selectedLocationId !== Context.location.current().id) {
            Context.location.switchTo(selectedLocationId);
        }
    };

    return (
        <select onChange={handleChange} className="location-switch">
            {locations.map(location => {
                if (!location.public) {
                    return null
                }

                if (location.id === Context.location.current().id) {
                    return <option selected value={location.id}>{location.name}</option>
                }

                return <option value={location.id}>{location.name}</option>
            })}
        </select>
    )
};

const Navigation = () => {
    const {user, authenticated} = useContext(UserContext);

    if (!authenticated) {
        return (
            <header className="header">
                <ul>
                    <li>
                        <Link to={'/login'} className="logo">
                            BlocBeta
                        </Link>
                    </li>
                </ul>
            </header>
        )
    }

    return (
        <header className="header">
            <ul className="location-switch">
                <li>
                    <Link to={Context.getPath('/dashboard')} className="logo">BlocBeta @</Link>
                    <LocationSwitch/>
                </li>
            </ul>

            <ul className="navigation">
                <li>
                    <Link to={Context.getPath('/boulder')}>Boulder</Link>
                </li>
                <li>
                    <Link to={Context.getPath('/ranking/current')}>Ranking</Link>
                </li>
                <li>
                    <Link to={'/account'}>[{user.username}]</Link>
                </li>
                <li>
                    <Button onClick={(event) => handleLogout(event)}>Out!</Button>
                </li>
            </ul>
        </header>
    )
};

export default Navigation