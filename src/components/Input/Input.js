import React from 'react';
import './Input.css';

const Input = ({register, name, ...rest}) => {
    return <input name={name} ref={register} {...rest}/>;
};

export default Input