import React, { useEffect, useState } from "react";
import { set } from "lodash";
import { FormElement } from "../components/Form/Form";

export const composeFormElement = (
  name,
  label,
  value,
  Component,
  onChange,
  additionalInputProps = {}
) => {
  const inputProps = {
    name: name,
    id: name,
    value: value ? value : "",
    onChange: onChange,
    ...additionalInputProps,
  };

  return (
    <FormElement name={name} label={label}>
      {React.createElement(
        Component,
        inputProps,
        additionalInputProps.children
      )}
    </FormElement>
  );
};

const dataResolvers = {
  "select-multiple": (current, event) => {
    set(
      current,
      event.target.name,
      Array.from(event.target.selectedOptions, (option) => option.value)
    );
  },
  "styled-multiselect": (current, event) => {
    set(
      current,
      event.target.name,
      event.target.selected.map((option) => option.value)
    );
  },
  "styled-select": (current, event) => {
    const selected = event.target.selected;
    set(
      current,
      event.target.name,
      selected.length > 0 ? selected.map((option) => option.value)[0] : null
    );
  },
  checkbox: (current, event) => {
    set(current, event.target.name, event.target.checked);
  },
};

export const useForm = (defaults) => {
  const [formData, setFormData] = useState(defaults);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event, callback) => {
    setSubmitting(true);

    event.preventDefault();
    await callback(formData);

    setSubmitting(false);
  };

  const setKeyValue = (key, value) => {
    const current = { ...formData };

    set(current, key, value);
    setFormData({ ...current });
  };

  const observeField = (event) => {
    const current = { ...formData };
    const resolver = dataResolvers[event.target.type];

    if (!resolver) {
      set(current, event.target.name, event.target.value);
    } else {
      resolver(current, event);
    }

    setFormData({ ...current });
  };

  const resetForm = () => {
    setFormData(defaults);
  };

  return {
    formData,
    setFormData,
    setKeyValue,
    handleSubmit,
    submitting,
    setSubmitting,
    observeField,
    resetForm,
  };
};
