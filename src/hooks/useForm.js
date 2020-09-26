import React, {useState, useEffect} from "react";
import {set} from "lodash";
import {FormElement} from "../components/Form/Form";

export const composeFormElement = (
  name,
  label,
  value,
  Component,
  observe,
  additionalInputProps = {}
) => {
  const inputProps = {
    name: name,
    id: name,
    value: value ? value : "",
    onChange: observe,
    ...additionalInputProps,
  };

  return (
    <FormElement name={name} label={label}>
      {React.createElement(Component, inputProps)}
    </FormElement>
  );
};

const useForm = (defaults) => {
  const [formData, setFormData] = useState(defaults);

  const handleSubmit = (event, callback) => {
    event.preventDefault();
    callback(formData);
  };

  const observeField = (event) => {
    const {name, value} = event.target;
    const current = {...formData};

    set(current, name, value);
    setFormData({...current});
  };


  useEffect(() => {
    setFormData(defaults);
  }, [defaults]);

  return {formData, setFormData, handleSubmit, observeField};
};

export default useForm;
