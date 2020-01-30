import React, {useState, useEffect} from 'react';
import {Loader} from "../../components/Loader";
import {Table} from "../../Helpers";
import ApiClient from "../../ApiClient";

const Current = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiClient.getCurrentComparison().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Compare</h1>
        </div>
    )
};

export default Current