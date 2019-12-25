import React, {useState, useEffect} from 'react';
import ApiClient from "../../../ApiClient";

export default function Index() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        ApiClient.getErrors().then(response => {
            setData(Object.values(response));
            setLoading(false);
        });

    }, []);

    if (loading) {
        return (
            <div className="loader">
                <em>loading</em>
            </div>
        )
    }

    console.log(data);

    return (
        <div className="container">
            <h1>Errors ({data.length})</h1>

            <ul className="list-unstyled">
                {data.map(error => {
                    return (
                        <li>
                            <strong>{error.author.username} @ {error.boulder.name} – {error.boulder.startWall.name}</strong>
                            <p>{error.description}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}