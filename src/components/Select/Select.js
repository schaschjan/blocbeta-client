import React from 'react';
import ReactSelect, {components} from "react-select";
import {Controller} from "react-hook-form";
import './Select.css';
import Icon from "../Icon/Icon";

const Select = ({options, multiple = false, clearable = false, validate, ...rest}) => {

    const DropdownIndicator = (props) => {
        return (
            <components.DropdownIndicator {...props}>
                <Icon name="downward"/>
            </components.DropdownIndicator>
        );
    };

    return (
        <Controller
            isMulti={multiple}
            as={
                <ReactSelect components={{DropdownIndicator}}
                             clearable={clearable}
                             className="react-select"
                             classNamePrefix="react-select"/>
            }
            options={options}
            rules={validate}
            {...rest}
        />
    );
};


export default Select