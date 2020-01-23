import React, {useState} from 'react';
import Context from "../Context";

export default function Dashboard(props) {

    const Walls = () => {
        return (
            <ul className="list-unstyled">

            </ul>
        )
    };

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <Walls/>
        </div>
    )
}