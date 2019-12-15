import React from 'react';
import {Link} from "react-router-dom";

export default function Header(props) {
    return (
        <header className="header">
            <ul>
                <li>
                    <Link to="/admin">
                        <strong>BlocBeta</strong>
                    </Link>
                </li>
            </ul>

            <ul>
                <li>
                    <Link to="/admin/boulder">Boulder</Link>
                </li>
                <li>
                    <Link to="/admin">Events</Link>
                </li>
                <li>
                    <Link to="/admin">Setters</Link>
                </li>
                <li>
                    <Link to="/admin">Errors</Link>
                </li>
                <li>
                    <Link to="/admin">Settings</Link>
                </li>
            </ul>
        </header>
    )
}