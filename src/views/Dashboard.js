import React, {useContext} from 'react';
import {Loader} from "../components/Loader/Loader";
import Context from "../Context";
import moment from "moment";
import {Messages} from "../Messages";
import {Link} from "react-router-dom";
import useApi, {api} from "../hooks/useApi";
import {AppContext} from "../App";

const Dashboard = () => {
    const {user} = useContext(AppContext);
    const {status: resetStatus, data: rotation} = useApi('resetRotation', api.stats.resetRotation);
    const {status: wallStatus, data: walls} = useApi('walls', api.walls.all);

    const loading = [
        resetStatus,
        wallStatus,
    ].includes('loading');

    if (loading) return <Loader/>;

    const rotationStats = walls.map(wall => {
        const reset = rotation.find(reset => reset.id === wall.id);

        return {
            wall: wall,
            averageSetDate: reset ? moment(reset.averageSetDate) : null
        }
    });

    rotationStats.sort((a, b) => {
        return a.averageSetDate < b.averageSetDate ? -1 : 1
    });

    return (
        <div className="container">
            <h1>Hello {user.username}!</h1>

            <h2>Reset Rotation</h2>
            <ul className="list-unstyled">
                {rotationStats.map(reset => {
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

            <h2>Boulders</h2>

            <ul>
                <li>
                    <Link to={{
                        pathname: Context.getPath('/boulder'),
                        search: "?ascent=todo",
                        state: {fromDashboard: true}
                    }}>
                        Todo
                    </Link>
                </li>

                <li>
                    <Link to={{
                        pathname: Context.getPath('/boulder'),
                        search: "?ascent=todo&date=new",
                        state: {fromDashboard: true}
                    }}>
                        New Todos
                    </Link>
                </li>

                <li>
                    <Link to={{
                        pathname: Context.getPath('/boulder'),
                        search: "?ascent=todo&date=new",
                        state: {fromDashboard: true}
                    }}>
                       Projects
                    </Link>
                </li>
            </ul>
        </div>
    )
};

export default Dashboard;