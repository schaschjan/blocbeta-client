import React, {useState} from "react";
import Container from "../../components/Container/Container";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {Meta} from "../../App";
import Form, {FormRow} from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import Wrapper from "../../components/Wrapper/Wrapper";
import Button from "../../components/Button/Button";
import {toast} from "react-toastify";
import {messages} from "../../messages";

const Register = () => {
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);
        console.log(data);
    };

    return (
        <Container>
            <Meta title='Register'/>
            <PageHeader title={'Register'}/>

            <Wrapper>
                <Form onSubmit={onSubmit}>
                    <FormRow>
                        <Label for='username'>Username</Label>
                        <Input id='username'
                               type='text'
                               validate={{ required: messages.required }}
                               name='username'/>
                    </FormRow>

                    <FormRow>
                        <Label for='email'>E-Mail</Label>
                        <Input id='email'
                               type='email'
                               validate={{ required: messages.required }}
                               name='email'/>
                    </FormRow>

                    <FormRow>
                        <Label for='password'>Password</Label>
                        <Input id='password'
                               type='password'
                               validate={{ required: messages.required }}
                               name='password'/>
                    </FormRow>

                    <Button type="submit" primary="true" disabled={submitting}>
                        Update
                    </Button>
                </Form>
            </Wrapper>
        </Container>
    );
};

export default Register;
