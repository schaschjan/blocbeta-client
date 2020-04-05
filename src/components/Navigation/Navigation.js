import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import Context from "../../Context";
import "./Navigation.css";
import Button from "../Button/Button";
import {AppContext} from "../../App";
import useApi, {api} from "../../hooks/useApi";
import Select, {getSelectOption} from "../Select/Select";
import {useHistory} from "react-router-dom";

const LocationSwitch = () => {
    const {status, data} = useApi('locations', api.locations.public);
    const {location} = useContext(AppContext);

    const handleChange = (event) => {
        const selectedLocationId = parseInt(event.target.value);

        if (selectedLocationId !== Context.location.current().id) {
            Context.location.switchTo(selectedLocationId);
        }
    };

    if (status === 'loading') return null;

    const locations = data.map(location => {
        return {
            label: location.name,
            value: location.id
        }
    });

    return <Select name="locations"
                   value={getSelectOption(location.id, location.name)}
                   options={locations} formChild={false}/>
};

const Navigation = () => {
    const {user, location, reset, locationPath} = useContext(AppContext);
    let history = useHistory();

    const logout = (event) => {
        event.preventDefault();
        reset();
        history.push('/login');
    };

    if (user === null || location === null) {
        return (
            <header className="header">
                <ul>
                    <li>
                        <Link to={locationPath('/login')} className="logo">
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
                    <Link to={locationPath('/dashboard')} className="logo">BlocBeta @</Link>
                    <LocationSwitch/>
                </li>
            </ul>

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