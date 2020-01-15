import React, {useState} from 'react';
import Context from "../Context";

export default function Dashboard(props) {

    const Walls = () => {
        return (
            <ul className="list-unstyled">
                {Object.values(Context.getWalls()).map(wall => {
                    if (wall.count === 0) {
                        return <li>{wall.name} ({wall.count}) 🛠️</li>
                    }

                    return <li>{wall.name} ({wall.count})</li>
                })}
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