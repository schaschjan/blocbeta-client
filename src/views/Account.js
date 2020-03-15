import React, {useState, useEffect} from 'react';
import {Loader} from "../components/Loader/Loader";
import ApiClient from "../ApiClient";
import {toast} from "react-toastify";
import Form from "../components/Form/Form";
import Label from "../components/Label/Label";
import Input from "../components/Input/Input";
import {Messages} from "../Messages";
import Button from "../components/Button/Button";

const Account = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = (data) => {
        setSubmitting(true);

        ApiClient.updateMe(data).then(data => {
            setSubmitting(false);
            toast.success("Account updated");
        });
    };

    useEffect(() => {
        ApiClient.getMe().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Account</h1>

            <Form onSubmit={onSubmit} defaultValues={data}>
                <Label>Visible</Label>
                <Input name="visible" type="checkbox"/>

                <Label>Username</Label>
                <Input name="username" disabled/>

                <Label>Email</Label>
                <Input name="email"
                       validate={{
                           required: Messages.required,
                           pattern: {
                               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                               message: Messages.email.invalid
                           }
                       }}/>

                <Label>Arm span</Label>
                <Input name="armSpan"
                       validate={{
                           required: Messages.required,
                           min: {
                               value: 120,
                               message: Messages.range.min(120, "arm span")
                           },
                           max: {
                               value: 220,
                               message: Messages.range.max(220, "arm span")
                           }
                       }}
                       type="number"/>

                <Label>Height</Label>
                <Input name="height"
                       validate={{
                           required: Messages.required,
                           min: {
                               value: 120,
                               message: "Minimal height is 120"
                           },
                           max: {
                               value: 220,
                               message: "Maximal height is 220"
                           }
                       }}
                       type="number"/>

                <Label>Weight</Label>
                <Input name="weight"
                       validate={{
                           required: Messages.required,
                           min: {
                               value: 40,
                               message: "Minimal weight is 40"
                           },
                           max: {
                               value: 120,
                               message: "Maximal weight is 120"
                           }
                       }}
                       type="number"/>

                <Button type="submit" primary="true" disabled={isSubmitting}>Update</Button>
            </Form>
        </div>
    )
};

export default Account