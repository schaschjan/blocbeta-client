import React from "react";
import "./Button.css";
import classnames from "classnames";

const Button = ({type, disabled, text, primary, secondary, children}) => {

    const classes = classnames(
        "button",
        disabled ? "button--disabled" : null,
        text ? "button--text" : null,
        primary ? "button--primary" : null,
        secondary ? "button--secondary" : null
    );

    return <button type={type} className={classes}>
        {children}
    </button>
};

export default Button;