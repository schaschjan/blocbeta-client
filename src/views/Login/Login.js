import React, {useState} from 'react';
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

const Login = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    let history = useHistory();

    const onSubmit = data => {
        setIsSubmitted(true);

        ApiClient.authorize(data.username, data.password).then(response => {
            setIsSubmitted(false);

            if (response.code === 401) {
                toast.error(response.message, {position: toast.POSITION.BOTTOM_RIGHT});
                return;
            }

            Context.authenticate(response.token);
            Context.storage.init();

            history.push(Context.getPath('/dashboard'))
        })
    };

    return (
        <Container>
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