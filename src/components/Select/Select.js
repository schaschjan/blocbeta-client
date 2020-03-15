import React, {Fragment, useEffect, useRef} from 'react';
import './Select.css';

const Select = ({register, options, name, multiple, ...rest}) => {

    return (
        <div className="select">
            <select name={name} ref={register} multiple={multiple} {...rest}>
                {options.map(option => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    );
};


export default Select