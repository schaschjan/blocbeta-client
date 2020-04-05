import React, {useState} from 'react';
import Container from "../../../components/Container/Container";
import {PageHeader} from "../../../components/PageHeader/PageHeader";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import {Messages} from "../../../Messages";
import Select from "../../../components/Select/Select";
import Context, {getOption, getOptions} from "../../../Context";
import Button from "../../../components/Button/Button";
import Form from "../../../components/Form/Form";
import ApiClient from "../../../ApiClient";
import {toast} from "react-toastify";
import Crud from "../../../services/Crud";

const defaultStatus = getOption(Context.core.states.find(state => state.id === 'active'));
const defaultPoints = 1000;

const Add = () => {
    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = (data) => {
        setSubmitting(true);

        ApiClient.boulder.create(Crud.boulder.resolveApiData(data))
            .then(() => {
                setSubmitting(false);
                toast.success(`Created ${data.name}`);
                // reset form
            });
    };

    return (
        <Container>
            <PageHeader title={`Add Boulder`}/>

            <Form onSubmit={onSubmit}>
                <Label>Name</Label>
                <Input type="text"
                       name="name"
                       validate={{required: Messages.required}}/>

                <Label>Grade</Label>
                <Select name="grade"
                        validate={{required: Messages.requiredOption}}
                        options={Context.storage.grades.options()}/>

                <Label>Hold Style</Label>
                <Select name="holdStyle"
                        validate={{required: Messages.requiredOption}}
                        options={Context.storage.holdStyles.options()}/>

                <Label>Start</Label>
                <Select name="startWall"
                        validate={{required: Messages.requiredOption}}
                        options={Context.storage.walls.options()}/>

                <Label>End</Label>
                <Select name="endWall"
                        validate={{required: Messages.requiredOption}}
                        options={Context.storage.walls.options()}/>

                <Label>Setters</Label>
                <Select name="setters"
                        multiple={true}
                        validate={{required: Messages.requiredOption}}
                        labelProperty="username"
                        options={Context.storage.setters.options('username', 'id')}/>

                <Label>Tags</Label>
                <Select name="tags"
                        multiple={true}
                        options={Context.storage.tags.options()}/>

                <Label>Status</Label>
                <Select name="status"
                        defaultValue={defaultStatus}
                        validate={{required: Messages.requiredOption}}
                        options={getOptions(Context.core.states)}/>

                <Label>Points</Label>
                <Input type="number"
                       name="points"
                       defaultValue={defaultPoints}
                       validate={{required: Messages.required}}/>

                <Button type="submit" primary="true" disabled={isSubmitting}>Create & New</Button>
            </Form>
        </Container>
    )
};

export default Add