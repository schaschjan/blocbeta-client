import React, {useState, Fragment} from "react";
import {Loader} from "../../../components/Loader/Loader";
import {useParams} from "react-router-dom";
import Form, {FormRow} from "../../../components/Form/Form";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import {messages} from "../../../messages";
import Container from "../../../components/Container/Container";
import {PageHeader} from "../../../components/PageHeader/PageHeader";
import {api, cacheKeys} from "../../../hooks/useApi";
import Wrapper from "../../../components/Wrapper/Wrapper";
import {store} from "../../../store";
import {getOptions} from "../../../helpers";
import {toast} from "react-toastify";
import {queryCache, useMutation} from "react-query";
import {Meta} from "../../../App";
import useBoulderFormData from "../../../hooks/useBoulderFormData";
import "./Edit.css";

const Edit = () => {
    const {boulderId} = useParams();
    const [submitting, setSubmitting] = useState(false);

    const {
        status,
        boulder,
        grades,
        walls,
        holdStyles,
        setters,
        tags
    } = useBoulderFormData(boulderId);

    const [updateBoulder] = useMutation(api.boulder.update, {
        throwOnError: true,
        onSuccess: () => {
            queryCache.refetchQueries(cacheKeys.boulders);
        },
    });

    const onSubmit = async (data) => {
        setSubmitting(true);

        try {
            await updateBoulder(boulderId, data);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    if (status !== 'resolved') return <Loader/>;

    return (
        <Fragment>
            <Meta title={`Edit ${boulder.name}`}/>

            <Container>
                <PageHeader title={`Edit ${boulder.name}`}/>
                <Wrapper>
                    <Form onSubmit={onSubmit} defaultValues={boulder} className="edit-boulder-form">
                        <FormRow>
                            <Label>Name</Label>
                            <Input
                                type="text"
                                name="name"
                                validate={{required: messages.required}}
                            />
                        </FormRow>

                        <FormRow className="grade">
                            <Label>Grade</Label>
                            <Select
                                name="grade"
                                mirror="internalGrade"
                                validate={{required: messages.requiredOption}}
                                options={getOptions(grades)}
                            />
                        </FormRow>

                        <FormRow className="internal-grade">
                            <Label>Internal Grade</Label>
                            <Select name="internalGrade" options={getOptions(grades)}/>
                        </FormRow>

                        <FormRow>
                            <Label>Hold Style</Label>
                            <Select
                                name="holdStyle"
                                validate={{required: messages.requiredOption}}
                                options={getOptions(holdStyles)}
                            />
                        </FormRow>

                        <FormRow className={'row-start'}>
                            <Label>Start</Label>
                            <Select
                                name="startWall"
                                validate={{required: messages.requiredOption}}
                                options={getOptions(walls)}
                            />
                        </FormRow>

                        <FormRow className={'row-end'}>
                            <Label>End</Label>
                            <Select
                                name="endWall"
                                validate={{required: messages.requiredOption}}
                                options={getOptions(walls)}
                            />
                        </FormRow>

                        <FormRow>
                            <Label>Setters</Label>
                            <Select
                                name="setters"
                                multiple={true}
                                validate={{required: messages.requiredOption}}
                                labelProperty="username"
                                options={getOptions(setters, "username")}
                            />
                        </FormRow>

                        <FormRow>
                            <Label>Tags</Label>
                            <Select name="tags" multiple={true} options={getOptions(tags)}/>
                        </FormRow>

                        <FormRow>
                            <Label>Status</Label>
                            <Select name="status" options={getOptions(store.states)}/>
                        </FormRow>

                        <FormRow>
                            <Label>Points</Label>
                            <Input
                                type="text"
                                name="points"
                                validate={{required: messages.required}}
                            />
                        </FormRow>

                        <Button secondary="true">
                            Cancel
                        </Button>

                        <Button type="submit" primary="true" disabled={submitting}>
                            Update
                        </Button>
                    </Form>
                </Wrapper>
            </Container>
        </Fragment>
    );
};

export default Edit;
