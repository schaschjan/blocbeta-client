import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BoulderForm} from "./Add";

export default function Edit(props) {
    const {boulderId} = useParams();

    const [hasError, setErrors] = useState(false);
    const [boulder, setBoulder] = useState({});
    const [loading, setLoading] = useState(true);

    async function fetchData() {
        const res = await fetch(`/boulder/${boulderId}`);
        res
            .json()
            .then(res => setBoulder(res))
            .catch(err => setErrors(err))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchData();
    }, [loading]);

    if (loading) {
        return (
            <div className="container">
                <em>loading…</em>
            </div>
        )
    }

    return (
        <div className="container">
            <h1>Edit Boulder {boulder.name}</h1>

            <BoulderForm/>
        </div>
    )
}