import React, {useState, useEffect} from 'react';
import ApiClient from "../ApiClient";
import {Loader} from "../components/Loader/Loader";
import Context from "../Context";
import moment from "moment";
import {Messages} from "../Messages";

const Dashboard = () => {

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            ApiClient.stats.resetRotation().then(response => {

                stats.resetRotation = Context.storage.walls.all().map(wall => {
                    return {
                        wall: wall,
                        averageSetDate: response.find(reset => reset.id === wall.id)
                    }
                });

                setStats(stats);
            }),
            ApiClient.stats.boulder.active().then(response => {
                stats.boulder = response;
                setStats(stats);
            })
        ]).then(() => {
            setLoading(false)
        });
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
                <li>{stats.boulder.activeBoulders} active boulders</li>
                <li>{stats.boulder.newBoulders} new boulders</li>
            </ul>

            <h2>Reset Rotation</h2>
            <ul className="list-unstyled">
                {stats.resetRotation.map(reset => {
                    let date = null;

                    if (reset.averageSetDate) {
                        date = `Last set: ${date = moment(reset.averageSetDate).format('D MMM')}`
                    } else {
                        date = Messages.reset
                    }

                    return <li>
                        {reset.wall.name} {date}
                    </li>
                })}
            </ul>

            <Walls/>
        </div>
    )
};

export default Dashboard;