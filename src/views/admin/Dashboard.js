import React from "react";
import {
    Link
} from "react-router-dom";

class Dashboard extends React.Component {

    render() {
        return (
            <ul className="card-container">
                <li className="card">
                    <div className="card-title">
                        Boulder
                    </div>

                    <div className="card-content">
                        <ul>
                            <li>
                                <Link to="/admin/boulder">
                                    List (90)
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/boulder">
                                    Add
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="card">
                    <div className="card-title">
                        Boulder
                    </div>

                    <div className="card-content">
                        <ul>
                            <li>
                                <Link to="/admin/boulder">
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/boulder/add">
                                    Add
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="card">
                    <div className="card-title">
                        Areas
                    </div>

                    <div className="card-content">
                        <ul>
                            <li>
                                <Link to="/admin/boulder">
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <Link to="/admin/boulder">
                                    Add
                                </Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="card">
                    Grades
                </li>
                <li className="card">
                    Holds
                </li>
                <li className="card">
                    Events
                </li>
            </ul>
        )
    }
}

export default Dashboard;