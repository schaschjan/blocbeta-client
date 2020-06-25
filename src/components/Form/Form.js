import React, { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import classnames from "classnames";
import Select from "../Select/Select";
import "./Form.css";
import Button from "../Button/Button";
import Input from "../Input/Input";
import Switch from "../Switch/Switch";
import { Textarea } from "../Textarea/Textarea";

export const resolveApiData = (data) => {
  data.startWall = data.startWall.value;
  data.endWall = data.endWall.value;
  data.grade = data.grade.value;
  data.internalGrade = data.internalGrade.value;
  data.holdStyle = data.holdStyle.value;
  data.status = data.status.value;

  data.setters = data.setters.map((setter) => {
    return setter.value;
  });

  if (data.tags) {
    data.tags = data.tags.map((tag) => {
      return tag.value;
    });
  }

  return data;
};

const Error = ({ message, ...rest }) => {
  return (
    <span className="form-error" {...rest}>
      {message}
    </span>
  );
};

export const FormRow = ({ children, className }) => {
  return <div className={classnames("form__row", className)}>{children}</div>;
};

function recursiveMap(children, fn) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveMap(child.props.children, fn),
      });
    }

    return fn(child);
  });
}

const Form = ({ defaultValues, children, onSubmit, className }) => {
  const { register, reset, errors, handleSubmit, control, setValue } = useForm({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const formElements = [Button, Select, Input, Switch, Textarea];

  const createFormElement = (child, classes) => {
    if (child.type === Select) {
      const SelectElement = (
        <Select isMulti={child.props.multiple} {...child.props} />
      );

      const controllerProps = {
        control: control,
        name: child.props.name,
        options: child.props.options,
        as: SelectElement,
        key: child.props.name,
        rules: child.props.validate,
      };

      if (child.props.mirror) {
        controllerProps.onChange = ([selected]) => {
          setValue(child.props.mirror, selected);

          return selected;
        };
      }

      return <Controller {...controllerProps} />;
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
      {recursiveMap(children, (child) => {
        const classes = classnames(
          errors[child.props.name] ? "has-error" : null
        );

        return (
          <Fragment key={child.props.name}>
            {formElements.includes(child.type)
              ? createFormElement(child, classes)
              : child}

            {errors[child.props.name] && (
              <Error message={errors[child.props.name].message} />
            )}
          </Fragment>
        );
      })}
    </form>
  );
};

export default Form;
