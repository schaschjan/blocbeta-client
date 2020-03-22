import React, {useState, useEffect, Fragment} from 'react';
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

const resolveFormData = (boulder) => {
    boulder.grade = Context.storage.grades.getOption(boulder.grade.id);
    boulder.holdStyle = Context.storage.holdStyles.getOption(boulder.holdStyle.id);
    boulder.startWall = Context.storage.walls.getOption(boulder.startWall.id);
    boulder.status = Context.storage.states.getOption(boulder.status);

    if (boulder.endWall) {
        boulder.endWall = Context.storage.walls.getOption(boulder.endWall.id);
    }

    boulder.tags = boulder.tags.map(tag => {
        return Context.storage.tags.getOption(tag.id)
    });

    boulder.setters = boulder.setters.map(setter => {
        return Context.storage.setters.getOption(setter.id, 'username')
    });
};

const resolveApiData = (boulder) => {
    boulder.grade = boulder.grade.value;
    boulder.holdStyle = boulder.holdStyle.value;
    boulder.startWall = boulder.startWall.value;
    boulder.status = boulder.status.value;

    if (boulder.endWall) {
        boulder.endWall = boulder.endWall.value;
    }

    boulder.tags = boulder.tags.map(tag => tag.value);
    boulder.setters = boulder.setters.map(setter => setter.value);
};

const Edit = ({history}) => {
    const {boulderId} = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadBoulder = async (boulderId) => {
            const boulder = await ApiClient.boulder.get(boulderId);
            resolveFormData(boulder);
            setData(boulder);
        };

        loadBoulder(boulderId).then(() => setLoading(false));
    }, [boulderId]);

    const onSubmit = (data) => {
        setSubmitting(true);
        resolveApiData(data);

        ApiClient.boulder.update(boulderId, data).then(() => {
            setSubmitting(false);
            history.push(Context.getPath('/boulder'));
            toast.success("Boulder updated");
        });
    };

    if (loading) return <Loader/>;

    return (
        <Fragment>
            <div className="container">
                <h1>Edit {data.name}</h1>

                <Form onSubmit={onSubmit} defaultValues={data}>
                    <Label>Name</Label>
                    <Input type="text"
                           name="name"
                           validate={{required: Messages.required}}/>

                    <Label>Grade</Label>
                    <Select name="grade"
                            options={Context.storage.grades.options()}/>

                    <Label>Holdstyle</Label>
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
            </div>
        </Fragment>
    )
};

export default withRouter(Edit);