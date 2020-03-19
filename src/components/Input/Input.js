import React from 'react';
import './Input.css';
import Icon from "../Icon/Icon";
import classnames from "classnames";

const Input = ({register, icon, type, ...rest}) => {

    return (
        <div className={classnames("input", type == "checkbox" ? "input--checkbox" : null)}>
            {icon && (
                <Icon name={icon}/>
            )}

            <input ref={register} type={type} {...rest}/>
        </div>
    );
};

export default Input