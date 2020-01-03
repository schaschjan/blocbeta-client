import ApiClient from "../../../ApiClient";
import React, {useState, useEffect} from 'react';

export default function Index() {

    const [setters, setSetters] = useState(null);
    const [admins, setAdmins] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            ApiClient.getSetters().then(response => {
                setSetters(Object.values(response));
            }),
            ApiClient.getAdmins().then(response => {
                setAdmins(Object.values(response));
            })
        ]).then(() => {
            setLoading(false);
        })

    }, []);

    if (loading) {
        return (
            <div className="loader">
                <em>loading</em>
            </div>
        )
    }
    return (
        <div className="container">
            <h1>Setters ({setters.length})</h1>

            <ul>
                {setters.map(user => {
                    return <li>{user.username}</li>
                })}
            </ul>


            <h1>Admins ({admins.length})</h1>
        </div>
    )
}