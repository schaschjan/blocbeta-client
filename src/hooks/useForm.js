import React, {useState} from 'react'
import {set} from 'lodash'
import {FormElement} from './../index'

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
    value: value ? value : '',
    onChange: onChange,

    ...additionalInputProps
  };

  return (
    <FormElement name={name} label={label}>
      {React.createElement(Component, inputProps, additionalInputProps.children)}
    </FormElement>
  )
};

export const useForm = (defaults) => {
  const [formData, setFormData] = useState(defaults);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event, callback) => {
    setSubmitting(true);

    event.preventDefault();
    await callback(formData);

    setSubmitting(false)
  };

  const observeField = (event) => {
    const {name, value, checked} = event.target;
    const current = {...formData};

    if (event.target.type === "checkbox") {
      set(current, name, checked);
    } else {
      set(current, name, value);
    }

    setFormData({...current})
  };

  return {formData, setFormData, handleSubmit, submitting, setSubmitting, observeField}
};
