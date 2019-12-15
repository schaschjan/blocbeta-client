import Icon from "../Icon";
import ReactSelect from "react-select";
import {getOptions} from "../../Helpers";
import React from "react";

const DropdownIndicator = () => {
    return <Icon name="indicator"/>
};

export const GradeSelect = () => {
    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            components={{DropdownIndicator}}
            options={getOptions(window.grades)}
            placeholder="Grade"/>
    )
};

export const ColorSelect = () => {
    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            components={{DropdownIndicator}}
            options={getOptions(window.colors)}
            placeholder="Color"/>
    )
};

export const WallSelect = (props) => {
    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            components={{DropdownIndicator}}
            options={getOptions(props.options)}
            placeholder={props.label}/>
    )
};

export const SetterSelect = () => {
    const options = Object.values(window.setters).map(element => {
        return {
            value: element.id,
            label: element.username
        }
    });

    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            components={{DropdownIndicator}}
            options={options}
            placeholder="Setters"/>
    )
};

export const TagSelect = () => {
    const options = Object.values(window.tags).map(element => {
        return {
            value: element.id,
            label: `${element.emoji} - ${element.name}`
        }
    });

    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            components={{DropdownIndicator}}
            options={options}
            placeholder="Tags"/>
    )
};

export const StatusSelect = () => {

    const options = [
        {
            label: 'active',
            value: 'active'
        },
        {
            label: 'inactive',
            value: 'inactive'
        }
    ];

    const defaultOptions = {
        label: 'active',
        value: 'active'
    };

    return (
        <ReactSelect
            className="select"
            classNamePrefix="select"
            components={{DropdownIndicator}}
            options={options}
            value={{label: 'active', value: 'active'}}/>
    )
};