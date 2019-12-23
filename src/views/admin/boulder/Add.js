import React, {useState, useEffect} from 'react';
import {getBoulders} from "../../../Helpers";
import BoulderForm from "./Form";

export default function Add() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBoulders().then(boulders => {
            setData(boulders);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <em>loading…</em>
        )
    }

    return (
        <div>
            <BoulderForm/>
        </div>
    )
}
