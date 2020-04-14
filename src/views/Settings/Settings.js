import React, {useState} from 'react';
import Container from "../../components/Container/Container";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import useApi, {api, cacheKeys} from "../../hooks/useApi";
import Input from "../../components/Input/Input";

const Settings = () => {

    const [users, setUsers] = useState([]);

    const onSearch = async (event) => {
        const term = event.target.value;

        if (term.length > 1) {
            const results = await api.user.find(term);

            setUsers(results);
        }
    };

    return (
        <Container>
            <PageHeader title={`Settings`}/>

            <Input type="search" onChange={(event) => onSearch(event)}/>
            <ul>
                {users.map(user=> {
                    return <li>{user.username}</li>
                })}
            </ul>

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