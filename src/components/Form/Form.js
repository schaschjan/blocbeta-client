import React from "react";
import {useForm} from "react-hook-form";
import "./Form.css";
import classnames from "classnames";

const Error = ({message}) => {
    return <span className="form-error">{message}</span>
};

const Form = ({defaultValues, children, onSubmit}) => {
    console.log(defaultValues);
    const {register, errors, handleSubmit} = useForm({defaultValues});

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {Array.isArray(children) ? children.map(child => {
                const classes = classnames(errors[child.props.name] ? 'input--error' : null);

                return (
                    <React.Fragment>
                        {
                            child.props.name ? React.createElement(child.type, {
                                    ...{
                                        ...child.props,
                                        register: register(child.props.validate),
                                        key: child.props.name,
                                        className: classes,
                                    }
                                })
                                : child
                        }

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