import React from 'react';
import './Input.css';
import Icon from "../Icon/Icon";
import classnames from "classnames";

const Input = ({register, ref, icon, type, ...rest}) => {

    return (
        <div className={classnames("input", type === "checkbox" ? "input--checkbox" : null)}>
            {icon && (
                <Icon name={icon}/>
            )}

            <input ref={register || ref} type={type} {...rest}/>
        </div>
    );
};

export default Input