import React, {useState, useEffect} from 'react';
import ApiClient from "../ApiClient";
import {Loader} from "../components/Loader/Loader";

const Dashboard = () => {

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            ApiClient.wallStats().then(response => {
                stats.walls = response;
                setStats(stats);
            }),
            ApiClient.boulderStats().then(response => {
                stats.boulder = response;
                setStats(stats);
            })
        ]).then(() => {
            setLoading(false)
        });
    });

    const Walls = () => {
        return (
            <ul className="list-unstyled">

            </ul>
        )
    };

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Dashboard</h1>

            <ul className="list-unstyled">
                <li>{stats.boulder.activeBoulders} active boulders</li>
                <li>{stats.boulder.newBoulders} new boulders</li>
            </ul>

            <ul className="list-unstyled">
                {stats.walls.map(wall => {
                    return <li>
                        {wall.name} {wall.count}
                    </li>
                })}
            </ul>

            <Walls/>
        </div>
    )
};

export default Dashboard;