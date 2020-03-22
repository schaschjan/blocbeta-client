import React from 'react';
import ReactSelect from "react-select";
import {Controller} from "react-hook-form";
import './Select.css';

const Select = ({options, multiple = false, ...rest}) => {
    return (
        <Controller
            isMulti={multiple}
            as={ReactSelect}
            options={options}
            {...rest}
        />
    );
};


export default Select