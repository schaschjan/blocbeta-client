import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Form from "../../components/Form/Form";
import Container from "../../components/Container/Container";
import Label from "../../components/Label/Label";
import {Link} from "react-router-dom";
import "./Login.css";
import {toast} from 'react-toastify';
import {AppContext} from "../../App";
import jwt_decode from "jwt-decode";
import {api, getUri} from "../../hooks/useApi";
import axios from "axios";
import {useIsFetching, queryCache} from 'react-query'
import {Loader} from "../../components/Loader/Loader";

const Login = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {setUser, setToken, setLocation, setExpiration} = useContext(AppContext);

    const history = useHistory();
    const isFetching = useIsFetching();

    const getToken = async (username, password) => {
        try {
            const {data} = await axios.post(getUri('/login'), {
                "username": username,
                "password": password,
            });

            return {token: data.token, success: true}
        } catch (error) {
            return {error: error, success: false}
        }
    };

    const onSubmit = async (data) => {
        setIsSubmitted(true);
        const {token, error, success} = await getToken(data.username, data.password);

        if (!success) {
            toast.error(error.response.data.message, {position: toast.POSITION.BOTTOM_RIGHT});
            setIsSubmitted(false);

            return
        }

        const payload = jwt_decode(token);

        setExpiration(payload.exp);
        setUser(payload.user);
        setLocation(payload.location);
        setToken(token);

        setIsSubmitted(false);

        // const prefetch = async () => {
        //     await queryCache.prefetchQuery('locations', () => api.locations.public);
        //     await queryCache.prefetchQuery('holdStyles', () => api.holdStyles.all);
        //     await queryCache.prefetchQuery('grades', () => api.grades.all);
        //     await queryCache.prefetchQuery('walls', () => api.walls.all);
        //
        //     return true;
        // };

        // await prefetch();

        history.push(`/${payload.location.url}/dashboard`);
    };

    return (
        <Container>
            {isFetching ? <Loader/> : null}

            <h1>Sign in</h1>

            <Form onSubmit={onSubmit}>
                <Label>Username</Label>
                <Input type="text"
                       validate={{required: 'Please provide your username'}}
                       placeholder="…"
                       name="username"/>

                <Label>Password</Label>
                <Input type="password"
                       validate={{required: 'Please provide your password'}}
                       placeholder="…"
                       name="password"/>

                {isSubmitted ? (
                    <Button primary="true" type="submit" disabled="true">Login</Button>
                ) : (
                    <Button primary="true" type="submit">Login</Button>
                )}
            </Form>

            <div className="support-links">
                <Link to="/register">Create Account</Link>
                <Link to="/reset-password" className="secondary">Forgot Password</Link>
            </div>
        </Container>
    )
};

export default Login