import React, { useState, useEffect, Fragment } from "react";
import { Loader } from "../../../components/Loader/Loader";
import { useParams } from "react-router-dom";
import Form from "../../../components/Form/Form";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import Select from "../../../components/Select/Select";
import Button from "../../../components/Button/Button";
import { messages } from "../../../messages";
import "./Edit.css";
import Container from "../../../components/Container/Container";
import { PageHeader } from "../../../components/PageHeader/PageHeader";
import useApi, { api, cacheKeys } from "../../../hooks/useApi";
import Wrapper from "../../../components/Wrapper/Wrapper";
import { store } from "../../../store";
import { getOption, getOptions } from "../../../helpers";
import { toast } from "react-toastify";
import { queryCache, useMutation } from "react-query";

const Edit = () => {
  const { boulderId } = useParams();
  const [submitting, setSubmitting] = useState(false);
  const [resolved, setResolved] = useState(false);

  const { status: boulderStatus, data: boulder } = useApi(
    [cacheKeys.boulders, boulderId],
    () => api.boulder.get(boulderId)
  );
  const { status: wallsStatus, data: walls } = useApi(
    cacheKeys.walls,
    api.walls.all
  );
  const { status: gradesStatus, data: grades } = useApi(
    cacheKeys.grades,
    api.grades.all
  );
  const { status: holdStylesStatus, data: holdStyles } = useApi(
    cacheKeys.holdStyles,
    api.holdStyles.all
  );
  const { status: tagsStatus, data: tags } = useApi(
    cacheKeys.tags,
    api.tags.all
  );
  const { status: settersStatus, data: setters } = useApi(
    cacheKeys.setters,
    api.setters.all
  );

  const getFormData = (boulder) => {
    boulder.startWall = getOption(
      walls.find((wall) => wall.id === boulder.startWall.id)
    );

    if (boulder.endWall) {
      boulder.endWall = getOption(
        walls.find((wall) => wall.id === boulder.endWall.id)
      );
    }

    boulder.setters = boulder.setters.map((boulderSetter) => {
      return getOption(
        setters.find((setter) => setter.id === boulderSetter.id),
        "username"
      );
    });

    boulder.tags = boulder.tags.map((boulderTag) => {
      return getOption(tags.find((tag) => tag.id === boulderTag.id));
    });

    boulder.grade = getOption(
      grades.find((grade) => grade.id === boulder.grade.id)
    );
    boulder.holdStyle = getOption(
      holdStyles.find((holdStyle) => holdStyle.id === boulder.holdStyle.id)
    );

    boulder.status = getOption(
      store.states.find((state) => boulder.status === state.name)
    );
  };

  const loading = [
    boulderStatus,
    wallsStatus,
    gradesStatus,
    holdStylesStatus,
    tagsStatus,
    settersStatus,
  ].includes("loading");

  useEffect(() => {
    if (loading) {
      return;
    }

    getFormData(boulder);
    setResolved(true);
  }, [loading]);

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

  if (!resolved) return <Loader />;

  return (
    <Fragment>
      <Container>
        <PageHeader title={`Edit ${boulder.name}`} />
        <Wrapper>
          <Form onSubmit={onSubmit} defaultValues={boulder}>
            <Label>Name</Label>
            <Input
              type="text"
              name="name"
              validate={{ required: messages.required }}
            />

            <Label>Grade</Label>
            <Select
              name="grade"
              validate={{ required: messages.requiredOption }}
              options={getOptions(grades)}
            />

            <Label>Hold Style</Label>
            <Select
              name="holdStyle"
              validate={{ required: messages.requiredOption }}
              options={getOptions(holdStyles)}
            />

            <Label>Start</Label>
            <Select
              name="startWall"
              validate={{ required: messages.requiredOption }}
              options={getOptions(walls)}
            />

            <Label>End</Label>
            <Select
              name="endWall"
              validate={{ required: messages.requiredOption }}
              options={getOptions(walls)}
            />

            <Label>Setters</Label>
            <Select
              name="setters"
              multiple={true}
              validate={{ required: messages.requiredOption }}
              labelProperty="username"
              options={getOptions(setters, "username")}
            />

            <Label>Tags</Label>
            <Select name="tags" multiple={true} options={getOptions(tags)} />

            <Label>Status</Label>
            <Select name="status" options={getOptions(store.states)} />

            <Label>Points</Label>
            <Input
              type="text"
              name="points"
              validate={{ required: messages.required }}
            />

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
