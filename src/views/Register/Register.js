import React, {useState} from "react";
import Container from "../../components/Container/Container";
import {PageHeader} from "../../components/PageHeader/PageHeader";
import {Meta} from "../../App";
import {FormRow} from "../../components/Form/Form";
import Input from "../../components/Input/Input";
import Label from "../../components/Label/Label";
import Wrapper from "../../components/Wrapper/Wrapper";
import Button from "../../components/Button/Button";
import useForm from "../../hooks/useForm";
import {getUri} from "../../hooks/useApi";
import axios from "axios";
import Select from "../../components/Select/Select";
import {store} from "../../store";
import {getOptions} from "../../helpers";
import FormError from "../../components/FormError/FormError";
import { useHistory } from "react-router-dom";

const Register = () => {
    let history = useHistory();

    const {handleSubmit} = useForm();
    const [formErrors, setFormErrors] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            await axios.post(getUri('/register', false), data);
            history.push('/login')
        } catch (error) {
            setFormErrors(error.response.data.form);
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <Container>
            <Meta title="Register"/>
            <PageHeader title={"Register"}/>

            <Wrapper>
                <form onSubmit={event => handleSubmit(event, onSubmit)}>
                    <FormRow>
                        <Label for="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            required
                        />

                        <FormError message={formErrors.username}/>
                    </FormRow>

                    <FormRow>
                        <Label for="gender">Gender</Label>
                        <Select id="gender"
                                options={getOptions(store.genders)}
                                name="gender"
                                required
                        />

                        <FormError message={formErrors.gender}/>
                    </FormRow>

                    <FormRow>
                        <Label for="email">E-Mail</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                        />

                        <FormError message={formErrors.email}/>
                    </FormRow>

                    <FormRow>
                        <Label for="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                        />

                        <FormError message={formErrors.password}/>
                    </FormRow>

                    <Button type="submit" primary="true" disabled={submitting}>
                        Register
                    </Button>
                </form>
            </Wrapper>
        </Container>
    );
};

export default Register;
