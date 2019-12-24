import React, {useState, useEffect} from 'react';
import {getBoulders} from "../../../Helpers";
import BoulderForm from "./Form";

export default function Add() {

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="container">
            <BoulderForm buttonText="Add"/>
        </div>
    )
}
