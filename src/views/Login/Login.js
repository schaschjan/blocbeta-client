import React, {useContext, useState} from 'react';
import ApiClient from "../../ApiClient";
import Context from "../../Context";
import {useHistory} from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Form from "../../components/Form/Form";
import Container from "../../components/Container/Container";
import Label from "../../components/Label/Label";
import {Link} from "react-router-dom";
import "./Login.css";
import {toast} from 'react-toastify';
import {UserContext} from "../../App";
import jwt_decode from "jwt-decode";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {setUser, setAuthenticated} = useContext(UserContext);

    let history = useHistory();

    const onSubmit = data => {
        setIsSubmitted(true);

        ApiClient.authorize(data.username, data.password).then(response => {
            setIsSubmitted(false);

            if (response.code === 401) {
                toast.error(response.message, {position: toast.POSITION.BOTTOM_RIGHT});
                return;
            }

            setLoading(true);
            const payload = jwt_decode(response.token);
            Context.authenticate(response.token);

            Context.storage.init().then(success => {
                setUser(payload.user);
                setAuthenticated(true);
                setLoading(false);

                history.push(Context.getPath('/dashboard'))
            });
        })
    };

    return (
        <Container>
            <h1>Sign in</h1>

            {loading && <em>Loading storage…</em>}

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