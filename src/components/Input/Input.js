import React from 'react';
import './Input.css';
import Icon from "../Icon/Icon";

const Input = ({register, name, icon, ...rest}) => {

    return (
        <div className="input">
            {icon && (
                <Icon name={icon}/>
            )}

            <input name={name} ref={register} {...rest}/>
        </div>
    );
};

export default Input