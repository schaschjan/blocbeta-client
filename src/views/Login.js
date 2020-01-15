import React, {useState} from 'react';
import useForm from 'react-hook-form';
import ApiClient from "../ApiClient";
import Context from "../Context";
import {Redirect} from "react-router-dom";

export default function Login(props) {

    const {register, handleSubmit, errors, setError} = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = data => {
        setIsSubmitted(true);

        ApiClient.authorize(data.username, data.password).then(response => {
            setIsSubmitted(false);

            if (response.code === 401) {
                setError("global", "global", response.message);
            }

            Context.authorize(response.token);
        })
    };

    if (Context.isAuthenticated()) {
        return (
            <Redirect to={{pathname: `/${Context.getLocationUrl()}/dashboard`}}/>
        )
    }

    return (
        <div className="container">
            <h1>Login</h1>

            {errors.global &&
            <span className="form-error">{errors.global.message}</span>
            }

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-row">
                    <input type="text" placeholder="Username" name="username"
                           ref={register({required: 'Please provide your username'})}/>

                    {errors.username &&
                    <span className="form-error">{errors.username.message}</span>
                    }
                </div>

                <div className="form-row">
                    <input type="password" placeholder="Password" name="password"
                           ref={register({required: 'Please provide your password'})}/>

                    {errors.password &&
                    <span className="form-error">{errors.password.message}</span>
                    }
                </div>

                <div className="form-row">
                    {isSubmitted ? (
                        <input type="submit" value="Submit" className="button button--disabled" disabled/>
                    ) : (
                        <input type="submit" value="Submit" className="button"/>
                    )}
                </div>
            </form>
        </div>
    )
}