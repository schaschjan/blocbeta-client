import React, {useState, useEffect} from 'react';
import ApiClient from "../ApiClient";
import {Loader} from "../components/Loader";

export default function Dashboard(props) {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiClient.locationStats().then(response => {
            setStats(response);
            setLoading(false);
        })
    }, []);

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
                <li>{stats.activeBoulders} active boulders</li>
                <li>{stats.newBoulders} new boulders</li>
            </ul>

            <Walls/>
        </div>
    )
}