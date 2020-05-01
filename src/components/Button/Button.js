import React from "react";
import "./Button.css";
import classnames from "classnames";

const Button = ({type, disabled, dangerous, text, primary, secondary, children, className, ...rest}) => {

    const classes = classnames(
        "button",
        disabled ? "button--disabled" : null,
        dangerous ? "button--dangerous" : null,
        text ? "button--text" : null,
        primary ? "button--primary" : null,
        secondary ? "button--secondary" : null,
        className
    );

    return <button type={type} className={classes} {...rest}>
        {children}
    </button>
};

export default Button;