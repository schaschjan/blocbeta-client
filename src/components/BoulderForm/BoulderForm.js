import React, { useContext } from "react";
import { FormRow } from "../Form/Form";
import TextField from "@material-ui/core/TextField";
import { Button } from "../Button/Button";
import { useForm } from "../../hooks/useForm";
import { errorToast, successToast, ToastContext } from "../Toaster/Toaster";
import { useRequest } from "../../hooks/useRequest";
import { sortItemsAlphabetically } from "../../helper/sortItemsAlphabetically";
import Grade from "../Grade/Grade";
import HoldType from "../HoldStyle/HoldType";
import { Select } from "../Select/Select";
import styles from "./BoulderForm.module.css";

BoulderForm.defaultProps = {
  data: {
    name: "",
    status: "active",
    points: 1000,
    start_wall: null,
    end_wall: null,
    grade: null,
    internal_grade: null,
    hold_type: null,
    tags: [],
    setters: [],
  },
};

function extractId(property) {
  return typeof property === "object" ? property.id : property;
}

function BoulderForm({ data, onSubmit, successMessage, resetOnSubmit = true }) {
  const {
    handleSubmit,
    setKeyValue,
    submitting,
    formData,
    resetForm,
  } = useForm(data);

  const { dispatch } = useContext(ToastContext);

  const submitForm = async (payload) => {
    try {
      await onSubmit({
        payload: {
          ...payload,
          start_wall: extractId(payload.start_wall),
          end_wall: extractId(payload.end_wall),
          grade: extractId(payload.grade),
          internal_grade: extractId(payload.internal_grade),
          hold_type: extractId(payload.hold_type),
          tags: payload.tags.map((tag) => extractId(tag)),
          setters: payload.setters.map((setter) => extractId(setter)),
        },
      });

      dispatch(successToast(successMessage));

      if (resetOnSubmit) {
        resetForm();
      }

      if (typeof window !== "undefined") {
        window.scrollTo(0, 0);
      }
    } catch (error) {
      dispatch(errorToast(error));
    }
  };

  return (
    <form onSubmit={(event) => handleSubmit(event, submitForm)}>
      <FormRow>
        <TextField
          label={"Name"}
          onChange={(event) => setKeyValue("name", event.target.value)}
          value={formData.name}
          required
        />
      </FormRow>

      <FormRow columns={2}>
        <WallSelect
          value={formData.start_wall}
          onChange={(event, newValue) => setKeyValue("start_wall", newValue)}
          label={"Start"}
          required
        />

        <WallSelect
          value={formData.end_wall}
          onChange={(event, newValue) => setKeyValue("end_wall", newValue)}
          label={"End"}
          required
        />
      </FormRow>

      <FormRow columns={2}>
        <GradeSelect
          value={formData.grade}
          onChange={(event, newValue) => setKeyValue("grade", newValue)}
          label={"Grade"}
          required
        />

        <GradeSelect
          value={formData.internal_grade}
          onChange={(event, newValue) =>
            setKeyValue("internal_grade", newValue)
          }
          label={"Internal grade"}
          required
        />
      </FormRow>

      <FormRow>
        <HoldTypeSelect
          value={formData.hold_type}
          onChange={(event, newValue) => setKeyValue("hold_type", newValue)}
          label={"Hold type"}
          required
        />
      </FormRow>

      <FormRow>
        <TagSelect
          value={formData.tags}
          onChange={(event, newValue) => setKeyValue("tags", newValue)}
          label={"Tags"}
        />
      </FormRow>

      <FormRow>
        <SetterSelect
          value={formData.setters}
          onChange={(event, newValue) => setKeyValue("setters", newValue)}
          label={"Setters"}
          required
        />
      </FormRow>

      <FormRow>
        <TextField
          label={"Points"}
          onChange={(event) => setKeyValue("points", event.target.value)}
          value={formData.points}
          type={"number"}
          required
        />
      </FormRow>

      <FormRow>
        <StatusSelect value={formData.status} label={"Status"} required />
      </FormRow>

      <Button
        type="submit"
        variant="primary"
        loader={true}
        loading={submitting}
        disabled={submitting}
      >
        Add
      </Button>
    </form>
  );
}

function TagSelect({ value, ...rest }) {
  const { data } = useRequest("/tag");

  if (value.every((item) => typeof item === "number") && data) {
    value = value.map((id) => data.find((item) => item.id === id));
  }

  return (
    <Select
      {...rest}
      value={value}
      multiple={true}
      options={data ? sortItemsAlphabetically(data, "name") : []}
      renderOption={(option) => `${option.emoji} ${option.name}`}
      getOptionLabel={(option) => option.name}
    />
  );
}

function SetterSelect({ value, ...rest }) {
  const { data } = useRequest("/setter");

  if (value.every((item) => typeof item === "number") && data) {
    value = value.map((id) => data.find((item) => item.id === id));
  }

  return (
    <Select
      {...rest}
      value={value}
      multiple={true}
      options={data ? sortItemsAlphabetically(data, "username") : []}
      renderOption={(option) => option.username}
      getOptionLabel={(option) => option.username}
    />
  );
}

function WallSelect({ value, ...rest }) {
  const { data } = useRequest("/wall", true, {
    params: {
      filter: "active",
    },
  });

  if (typeof value === "number" && data) {
    value = data.find((item) => item.id === value);
  }

  return (
    <Select
      {...rest}
      value={value}
      options={data ? sortItemsAlphabetically(data, "name") : []}
      renderOption={(option) => option.name}
      getOptionLabel={(option) => option.name}
    />
  );
}

function GradeSelect({ value, ...rest }) {
  const { data } = useRequest("/grade");

  if (typeof value === "number" && data) {
    value = data.find((item) => item.id === value);
  }

  return (
    <Select
      {...rest}
      value={value}
      options={data ? sortItemsAlphabetically(data, "name") : []}
      renderOption={(option) => (
        <Grade name={option.name} color={option.color} />
      )}
      getOptionLabel={(option) => option.name}
    />
  );
}

function HoldTypeSelect({ value, ...rest }) {
  const { data } = useRequest("/holdstyle");

  if (typeof value === "number" && data) {
    value = data.find((item) => item.id === value);
  }

  return (
    <Select
      {...rest}
      value={value}
      options={data ? sortItemsAlphabetically(data, "name") : []}
      renderOption={(option) => (
        <>
          <HoldType image={option.image} small={true} />
          <span className={styles.holdTypeName}>{option.name}</span>
        </>
      )}
      getOptionLabel={(option) => option.name}
    />
  );
}

function StatusSelect({ value, ...rest }) {
  const options = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Inactive",
      value: "inactive",
    },
  ];

  if (typeof value === "string") {
    value = options.find((option) => value === option.value);
  }

  return (
    <Select
      {...rest}
      value={value}
      options={options}
      renderOption={(option) => option.value}
      getOptionLabel={(option) => option.label}
    />
  );
}

export { BoulderForm };
