import React, {useState, useEffect, useRef, Fragment} from 'react';
import {Loader} from "../../../components/Loader/Loader";
import ApiClient from "../../../ApiClient";
import {useParams} from "react-router-dom";
import {resolveBoulder} from "../../../Helpers";
import "./Edit.css";
import Form from "../../../components/Form/Form";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import Context from "../../../Context";
import {Messages} from "../../../Messages";

const Edit = () => {
    const {boulderId} = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBoulder = async (boulderId) => {
            const boulder = await ApiClient.getBoulder(boulderId);

            boulder.grade = boulder.grade.id;
            boulder.holdStyle = boulder.holdStyle.id;
            boulder.startWall = boulder.startWall.id;
            boulder.endWall = boulder.endWall ? boulder.endWall.id : null;
            boulder.tags = boulder.tags.map(tag => tag.id);
            boulder.setters = boulder.setters.map(setter => setter.id);

            setData(boulder);
        };

        loadBoulder(boulderId).then(() => setLoading(false));
    }, [boulderId]);

    const onSubmit = (data) => {
        console.log(data);
    };

    if (loading) return <Loader/>;

    return (
        <Fragment>
            <div className="container">
                <h1>Edit ({data.name})</h1>

                <Form onSubmit={onSubmit} defaultValues={data}>
                    <Label>Name</Label>
                    <Input type="text" name="name" validate={{required: Messages["form.error.name.required"]}}/>

                    <Label>Grade</Label>
                    <Select name="grade" options={Context.storage.grades.options()}/>

                    <Label>Holdstyle</Label>
                    <Select name="holdStyle" options={Context.storage.holdStyles.options()}/>

                    <Label>Start</Label>
                    <Select name="startWall" options={Context.storage.walls.options()}/>

                    <Label>End</Label>
                    <Select name="endWall" options={Context.storage.walls.options()}/>

                    <Label>Status</Label>
                    <Select name="status" options={Context.storage.states.options()}/>

                    <Label>Points</Label>
                    <Input type="text" name="points" validate={{required: Messages["form.error.points.required"]}}/>

                    <Label>Setters</Label>
                    <Select name="setters"
                            multiple={true}
                            options={Context.storage.setters.options('username', 'id')}/>

                    <Label>Tags</Label>
                    <Select name="tags"
                            multiple={true}
                            options={Context.storage.tags.options('name', 'id')}/>

                    <Button type="submit" primary="true">Update</Button>
                </Form>
            </div>
        </Fragment>
    )
};

export default Edit;