import React, {useState, useEffect} from 'react';
import Container from "../../components/Container/Container";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import useApi, {api, cacheKeys} from "../../hooks/useApi";
import Input from "../../components/Input/Input";
import {motion, motionValue, useAnimation, useMotionValue, useTransform} from "framer-motion"
import SwipeOut from "../../components/SwipeOut/SwipeOut";


const Settings = () => {

    const onSearch = async (event) => {
        const term = event.target.value;

        if (term.length > 1) {
            const results = await api.user.find(term);

            // setUsers(results);
        }
    };

    const actions = (
        <button onClick={() => alert("tes")}>poop</button>
    );

    return (
        <Container>
            <PageHeader title={`Settings`}/>

            <SwipeOut actions={actions}>
                <div>facade a</div>
            </SwipeOut>

            <SwipeOut actions={actions}>
                <div>facade b</div>
            </SwipeOut>

            <ul>
                <li>Events</li>
                <li>Walls</li>
                <li>Grades</li>
                <li>Setters</li>
                <li>Tags</li>
            </ul>
        </Container>
    )
};

export default Settings