import React from "react";
import {useForm} from "react-hook-form";
import classnames from "classnames";
import Select from "../Select/Select";
import "./Form.css";

const Error = ({message}) => {
    return <span className="form-error">{message}</span>
};

const Form = ({defaultValues, children, onSubmit}) => {
    const {register, errors, handleSubmit, control} = useForm({defaultValues});

    const createFormElement = (child, classes) => {
        if (child.type.name === 'Select') {

            return <Select control={control}
                           options={child.options}
                           {...child.props}/>
        }

        return React.createElement(child.type, {
            ...{
                ...child.props,
                register: register(child.props.validate),
                key: child.props.name,
                className: classes
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {Array.isArray(children) ? children.map(child => {
                const classes = classnames(errors[child.props.name] ? 'has-error' : null);

                return (
                    <React.Fragment>
                        {child.props.name ? createFormElement(child, classes) : child}

                        {errors[child.props.name] && (
                            <Error message={errors[child.props.name].message}/>
                        )}
                    </React.Fragment>
                );
            }) : children}
        </form>
    );
};

export default Form;