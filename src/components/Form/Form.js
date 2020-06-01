import React, { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import classnames from "classnames";
import Select from "../Select/Select";
import "./Form.css";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Switch from "../Switch/Switch";

const Error = ({ message, ...rest }) => {
  return (
    <span className="form-error" {...rest}>
      {message}
    </span>
  );
};

const Form = ({ defaultValues, children, onSubmit, className}) => {
  const { register, errors, handleSubmit, control } = useForm({
    defaultValues,
  });

  const formElements = [Button, Select, Input, Switch];

  const createFormElement = (child, classes) => {
    if (child.type === Select) {
      return (
        <Controller
          rules={child.props.validate}
          key={child.props.name}
          as={<Select isMulti={child.props.multiple} />}
          options={child.props.options}
          name={child.props.name}
          isClearable
          control={control}
        />
      );
    }

    if (child.type === Button) {
      return <Button {...child.props}>{child.props.children}</Button>;
    }

    return React.createElement(child.type, {
      ...{
        ...child.props,
        register: register(child.props.validate),
        key: child.props.name,
        className: classes,
      },
    });

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {Array.isArray(children)
        ? children.map((child) => {
            const classes = classnames(
              errors[child.props.name] ? "has-error" : null
            );

            return (
              <Fragment key={child.props.name}>
                {formElements.includes(child.type) ? createFormElement(child, classes) : child}

                {errors[child.props.name] && (
                  <Error message={errors[child.props.name].message} />
                )}
              </Fragment>
            );
          })
        : children}
    </form>
  );
};

export default Form;
