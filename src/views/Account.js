import React from 'react';
import {Loader} from "../components/Loader/Loader";
import {toast} from "react-toastify";
import Form from "../components/Form/Form";
import Label from "../components/Label/Label";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import useApi, {api} from "../hooks/useApi";
import {Messages} from "../Messages";
import {useMutation} from "react-query";
import Container from "../components/Container/Container";
import {PageHeader} from "../components/PageHeader/PageHeader";

const Account = () => {
    const {status, data} = useApi('me', api.me.get, false);
    const [mutate, {status: updateStatus}] = useMutation(api.me.update, {
        throwOnError: true
    });

    const onSubmit = async (data) => {
        try {
            await mutate(data);
            toast.success("Account updated");
        } catch (error) {
            toast.error(error.response.data.message)
        }
    };

    const scheduleAccountDeletion = async () => {
        if (window.confirm("Confirm account deletion")) {
            const data = await api.me.delete();
            toast.warn(data.message)
        }
    };

    if (status === 'loading') return <Loader/>;

    return (
        <Container>
            <PageHeader title={`Account`}/>

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

                <Button type="submit" primary="true" disabled={updateStatus === "loading"}>Update</Button>
            </Form>

            <Button dangerous={true} onClick={() => scheduleAccountDeletion()}>Delete Account</Button>
        </Container>
    )
};

export default Account