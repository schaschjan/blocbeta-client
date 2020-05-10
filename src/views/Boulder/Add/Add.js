import React, { useState } from "react";
import Container from "../../../components/Container/Container";
import { PageHeader } from "../../../components/PageHeader/PageHeader";
import Label from "../../../components/Label/Label";
import Input from "../../../components/Input/Input";
import { Messages } from "../../../Messages";
import Select from "../../../components/Select/Select";
import Context, { getOption, getOptions } from "../../../Context";
import Button from "../../../components/Button/Button";
import Form from "../../../components/Form/Form";
import ApiClient from "../../../ApiClient";
import { toast } from "react-toastify";
import Crud from "../../../services/Crud";
import useApi, { api, cacheKeys } from "../../../hooks/useApi";
import { Loader } from "../../../components/Loader/Loader";
import Wrapper from "../../../components/Wrapper/Wrapper";

const defaultStatus = getOption(
  Context.core.states.find((state) => state.id === "active")
);
const defaultPoints = 1000;

const Add = () => {
  const [submitting, setSubmitting] = useState(false);

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

  const loading = [
    wallsStatus,
    gradesStatus,
    holdStylesStatus,
    tagsStatus,
    settersStatus,
  ].includes("loading");

  const onSubmit = (data) => {
    setSubmitting(true);

    ApiClient.boulder.create(Crud.boulder.resolveApiData(data)).then(() => {
      setSubmitting(false);
      toast.success(`Created ${data.name}`);
      // reset form
    });
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <PageHeader title={`Add Boulder`} />

      <Wrapper>
        <Form onSubmit={onSubmit}>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            validate={{ required: Messages.required }}
          />

          <Label>Grade</Label>
          <Select
            name="grade"
            validate={{ required: Messages.requiredOption }}
            options={getOptions(grades)}
          />

          <Label>Hold Style</Label>
          <Select
            name="holdStyle"
            validate={{ required: Messages.requiredOption }}
            options={getOptions(holdStyles)}
          />

          <Label>Start</Label>
          <Select
            name="startWall"
            validate={{ required: Messages.requiredOption }}
            options={getOptions(walls)}
          />

          <Label>End</Label>
          <Select
            name="endWall"
            validate={{ required: Messages.requiredOption }}
            options={getOptions(walls)}
          />

          <Label>Setters</Label>
          <Select
            name="setters"
            multiple={true}
            validate={{ required: Messages.requiredOption }}
            labelProperty="username"
            options={getOptions(setters, "username")}
          />

          <Label>Tags</Label>
          <Select name="tags" multiple={true} options={getOptions(tags)} />

          <Label>Status</Label>
          <Select
            name="status"
            defaultValue={defaultStatus}
            validate={{ required: Messages.requiredOption }}
            options={getOptions(Context.core.states)}
          />

          <Label>Points</Label>
          <Input
            type="number"
            name="points"
            defaultValue={defaultPoints}
            validate={{ required: Messages.required }}
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
