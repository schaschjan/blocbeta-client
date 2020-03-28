import React, {useState, useEffect, reset, Fragment} from 'react';
import {Loader} from "../../../components/Loader/Loader";
import ApiClient from "../../../ApiClient";
import {useParams} from "react-router-dom";
import {withRouter} from "react-router-dom";
import Form from "../../../components/Form/Form";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Context from "../../../Context";
import {Messages} from "../../../Messages";
import {toast} from "react-toastify";
import "./Edit.css";
import Container from "../../../components/Container/Container";
import {PageHeader} from "../../../components/PageHeader/PageHeader";
import Crud from "../../../services/Crud";

const Edit = ({history}) => {
    const {boulderId} = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        ApiClient.boulder.get(boulderId)
            .then(boulder => {
                return Crud.boulder.resolveFormData(boulder);
            })
            .then(boulder => {
                setData(boulder);
                setLoading(false);
            });

    }, [boulderId]);

    const onSubmit = (data) => {
        setSubmitting(true);

        ApiClient.boulder.update(boulderId, Crud.boulder.resolveApiData(data))
            .then(() => {
                setSubmitting(false);
                history.push(Context.getPath('/boulder'));
                toast.success("Boulder updated");
                reset();
            });
    };

    if (loading) return <Loader/>;

    return (
        <Fragment>
            <Container>
                <PageHeader title={`Edit ${data.name}`}/>

                <Form onSubmit={onSubmit} defaultValues={data}>
                    <Label>Name</Label>
                    <Input type="text"
                           name="name"
                           validate={{required: Messages.required}}/>

                    <Label>Grade</Label>
                    <Select name="grade"
                            options={Context.storage.grades.options()}/>

                    <Label>Hold Style</Label>
                    <Select name="holdStyle"
                            options={Context.storage.holdStyles.options()}/>

                    <Label>Start</Label>
                    <Select name="startWall"
                            options={Context.storage.walls.options()}/>

                    <Label>End</Label>
                    <Select name="endWall"
                            options={Context.storage.walls.options()}/>

                    <Label>Setters</Label>
                    <Select name="setters"
                            multiple={true}
                            labelProperty="username"
                            options={Context.storage.setters.options('username', 'id')}/>

                    <Label>Tags</Label>
                    <Select name="tags"
                            multiple={true}
                            options={Context.storage.tags.options()}/>

                    <Label>Status</Label>
                    <Select name="status"
                            options={Context.storage.states.options()}/>

                    <Label>Points</Label>
                    <Input type="text"
                           name="points"
                           validate={{required: Messages.required}}/>

                    <Button type="submit" primary="true" disabled={isSubmitting}>Update</Button>
                </Form>
            </Container>
        </Fragment>
    )
};

export default withRouter(Edit);