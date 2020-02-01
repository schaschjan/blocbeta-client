import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import ApiClient from "../ApiClient";
import Context from "../Context";
import {withRouter} from "react-router-dom";

const Login = ({onAuthenticationSuccess, history}) => {

    const {register, handleSubmit, errors, setError} = useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmit = data => {
        setIsSubmitted(true);

        ApiClient.authorize(data.username, data.password).then(response => {
            setIsSubmitted(false);

            if (response.code === 401) {
                setError("global", "global", response.message);
                return;
            }

            Context.authenticate(response.token);
            Context.init();

            onAuthenticationSuccess(response);
            history.push(Context.getPath('/dashboard'))
        })
    };

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
                        <input type="submit" value="Login" className="button button--disabled" disabled/>
                    ) : (
                        <input type="submit" value="Login" className="button"/>
                    )}
                </div>
            </form>
        </div>
    )
};

export default withRouter(Login)