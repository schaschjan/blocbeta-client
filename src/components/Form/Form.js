import React, {Fragment} from "react";
import {Controller, useForm} from "react-hook-form";
import classnames from "classnames";
import Select from "../Select/Select";
import "./Form.css";
import Button from "../Button/Button";
import Input from "../Input/Input";

const Error = ({message, ...rest}) => {
    return (
        <span className="form-error" {...rest}>
      {message}
    </span>
    );
};

const Form = ({defaultValues, children, onSubmit}) => {
    const {register, errors, handleSubmit, control, formState} = useForm({
        defaultValues,
    });

    const formElements = [
        Button,
        Select,
        Input
    ];

    const createFormElement = (child, classes) => {
        if (child.type === Select) {
            return (
                <Controller
                    key={child.props.name}
                    as={<Select/>}
                    options={child.props.options}
                    name={child.props.name}
                    isClearable
                    control={control}
                />
            );
        }

        if (child.type === Button) {
            return (
                <Button {...child.props} disabled={child.props.disabled || !formState.dirty}>
                    {child.props.children}
                </Button>
            )
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
        <form onSubmit={handleSubmit(onSubmit)}>
            {Array.isArray(children)
                ? children.map((child) => {
                    const classes = classnames(
                        errors[child.props.name] ? "has-error" : null
                    );

                    return (
                        <Fragment key={child.props.name}>
                            {formElements.includes(child.type) ? createFormElement(child, classes) : child}

                            {errors[child.props.name] && (
                                <Error
                                    message={errors[child.props.name].message}
                                    key={child.props.name}
                                />
                            )}
                        </Fragment>
                    );
                })
            : children}
        </form>
    );
};

export default Form;
