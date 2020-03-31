import React, {useState, useEffect} from 'react';
import ApiClient from "../ApiClient";
import {Loader} from "../components/Loader/Loader";
import Context from "../Context";
import moment from "moment";
import {Messages} from "../Messages";
import {Link} from "react-router-dom";

const Dashboard = () => {

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            ApiClient.stats.resetRotation().then(response => {
                stats.resetRotation = Context.storage.walls.all().map(wall => {
                    const reset = response.find(reset => reset.id === wall.id);

                    return {
                        wall: wall,
                        averageSetDate: reset ? moment(reset.averageSetDate) : null
                    }
                });

                stats.resetRotation.sort((a, b) => {
                    return a.averageSetDate < b.averageSetDate ? -1 : 1
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
    }, [stats]);

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
                        date = `Last set: ${moment(reset.averageSetDate).fromNow()}`
                    } else {
                        date = Messages.reset
                    }

                    return <li>
                        {reset.wall.name} {date}
                    </li>
                })}
            </ul>

            <Walls/>

            <h2>Boulders</h2>

            <ul>
                <li>
                    <Link to={{
                        pathname: Context.getPath('/boulder'),
                        search: "?ascent=todo",
                        state: { fromDashboard: true }
                    }}>
                        Todo
                    </Link>
                </li>

                <li>
                    <Link to={{
                        pathname: Context.getPath('/boulder'),
                        search: "?ascent=todo&date=new",
                        state: { fromDashboard: true }
                    }}>
                        New Todos
                    </Link>
                </li>
            </ul>
        </div>
    )
};

export default Dashboard;