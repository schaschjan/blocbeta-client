import React, {useState} from "react";
import Container from "../../../components/Container/Container";
import {PageHeader} from "../../../components/PageHeader/PageHeader";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import {messages} from "../../../messages";
import Select from "../../../components/Select/Select";
import {getOption, getOptions} from "../../../helpers";
import Button from "../../../components/Button/Button";
import Form from "../../../components/Form/Form";
import useApi, {api, cacheKeys} from "../../../hooks/useApi";
import {Loader} from "../../../components/Loader/Loader";
import Wrapper from "../../../components/Wrapper/Wrapper";
import {store} from "../../../store";
import {queryCache, useMutation} from "react-query";
import {toast} from "react-toastify";

const defaultStatus = getOption(
    store.states.find((state) => state.id === "active")
);

const Add = () => {
    const [submitting, setSubmitting] = useState(false);

    const {status: wallsStatus, data: walls} = useApi(
        cacheKeys.walls,
        api.walls.all
    );
    const {status: gradesStatus, data: grades} = useApi(
        cacheKeys.grades,
        api.grades.all
    );
    const {status: holdStylesStatus, data: holdStyles} = useApi(
        cacheKeys.holdStyles,
        api.holdStyles.all
    );
    const {status: tagsStatus, data: tags} = useApi(
        cacheKeys.tags,
        api.tags.all
    );
    const {status: settersStatus, data: setters} = useApi(
        cacheKeys.setters,
        api.setters.all
    );

    const defaults = {
        status: getOption(store.states.find(state => state.id === 'active')),
        points: 1000
    };

    const loading = [
        wallsStatus,
        gradesStatus,
        holdStylesStatus,
        tagsStatus,
        settersStatus,
    ].includes("loading");

    const [mutateOnAddBoulder] = useMutation(api.boulder.add, {
        onSuccess: () => {
            queryCache.refetchQueries(cacheKeys.boulders);
        },
    });

    const addBoulder = async (data) => {
        try {
            await mutateOnAddBoulder(data);
            toast.success(`Added boulder ${data.name}`);
        } catch (error) {
            toast.error(messages.errors.general);
        }
    };

    const onSubmit = (data) => {
        setSubmitting(true);

        data.startWall = data.startWall.value;
        data.endWall = data.endWall.value;
        data.grade = data.grade.value;
        data.holdStyle = data.holdStyle.value;
        data.status = data.status.value;

        data.setters = data.setters.map(setter => {
            return setter.value
        });

        if (data.tags) {
            data.tags = data.tags.map(tag => {
                return tag.value
            });
        }

        addBoulder(data);
    };

    if (loading) return <Loader/>;

    return (
        <Container>
            <PageHeader title={`Add Boulder`}/>

            <Wrapper>
                <Form onSubmit={onSubmit} defaultValues={defaults}>
                    <Label>Name</Label>
                    <Input
                        type="text"
                        name="name"
                        validate={{required: messages.required}}
                    />

                    <Label>Grade</Label>
                    <Select
                        name="grade"
                        validate={{required: messages.requiredOption}}
                        options={getOptions(grades)}
                    />

                    <Label>Hold Style</Label>
                    <Select
                        name="holdStyle"
                        validate={{required: messages.requiredOption}}
                        options={getOptions(holdStyles)}
                    />

                    <Label>Start</Label>
                    <Select
                        name="startWall"
                        validate={{required: messages.requiredOption}}
                        options={getOptions(walls)}
                    />

                    <Label>End</Label>
                    <Select
                        name="endWall"
                        validate={{required: messages.requiredOption}}
                        options={getOptions(walls)}
                    />

                    <Label>Setters</Label>
                    <Select
                        name="setters"
                        multiple={true}
                        validate={{required: messages.requiredOption}}
                        labelProperty="username"
                        options={getOptions(setters, "username")}
                    />

                    <Label>Tags</Label>
                    <Select name="tags" multiple={true} options={getOptions(tags)}/>

                    <Label>Status</Label>
                    <Select
                        name="status"
                        defaultValue={defaultStatus}
                        validate={{required: messages.requiredOption}}
                        options={getOptions(store.states)}
                    />

                    <Label>Points</Label>
                    <Input
                        type="number"
                        name="points"
                        validate={{required: messages.required}}
                    />

                    <Button type="submit" primary="true" disabled={submitting}>
                        Create & New
                    </Button>
                </Form>
            </Wrapper>
        </Container>
    );
};

export default Add;
