import React from 'react';
import ReactSelect from "react-select";
import Icon from "./Icon";

export default function Select(props) {

    const DropdownIndicator = () => {
        return <Icon name="indicator"/>
    };

    return (
        <ReactSelect
            classNamePrefix={"select"}
            components={{DropdownIndicator}}
            className={"select form-field"}
            options={props.options}
        />
    )
}