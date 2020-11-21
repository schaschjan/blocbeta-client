import React from "react";
import {Close} from "../Icon/Close";
import "./Input.css";
import {classNames} from "../../helper/classNames";

const Input = ({
                   className,
                   onClear,
                   prefix,
                   type,
                   value,
                   filled = false,
                   size = "default",
                   children,
                   ...rest
               }) => {
    const classes = classNames(
        className,
        "input",
        `input--${type}`,
        `input--${size}`,
        filled ? "input--filled" : null
    );

    return (
        <div className={classes}>
            {prefix && <span>{prefix}</span>}

            {children} <input type={type} {...rest} value={value}/>

            {onClear && value && <Close onClick={(event) => onClear(event)}/>}
        </div>
    );
};

export {Input};
