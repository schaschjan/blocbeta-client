import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import BoulderForm from "./Form";
import ApiClient from "../../../ApiClient";
export default function Edit() {
    const {boulderId} = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiClient.getBoulder(boulderId).then(boulder => {

            const data = {
                name: boulder.name,
                tags: boulder.tags.map(tag => getTagOption(tag.id)),
                color: getColorOption(boulder.color.id),
                grade: getGradeOption(boulder.grade.id),
                startWall: getWallOption(boulder.startWall.id),
                endWall: (boulder.endWall) ? getWallOption(boulder.endWall.id) : null,
                setters: boulder.setters.map(setter => getSetterOption(setter.id)),
                status: getStatusOption(boulder.status)
            };

            setData(data);
            setLoading(false);
        });
    }, [boulderId]);

    const onSubmit = (data) => {
        console.log(data);
    };

    if (loading) {
        return (
            <div className="loader">
                <em>loading</em>
            </div>
        )
    }

    return (
        <div className="container">
            <BoulderForm values={data} onSubmit={onSubmit} buttonText="update"/>
        </div>
    )
}