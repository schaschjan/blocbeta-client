import React from "react";
import {Input} from "../components/Form";
import Select from "../components/Select";
import Button from "../components/Button";

export default function Login(props) {

    return (
        <div className="container">
            <h1>Login</h1>

            <div className="form-row">
                <Input type="text" name="username" placeholder="Username"/>
            </div>

            <div className="form-row">
                <Input type="password" name="password" placeholder="Password"/>
            </div>

            <div className="form-row">
                <Button type="primary">Login</Button>
            </div>
        </div>
    )
}