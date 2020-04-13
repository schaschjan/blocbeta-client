import React from 'react';
import './Ascent.css';
import Icon from "../Icon/Icon";
import classnames from "classnames";

const Ascent = ({type, checked, disabled, ...rest}) => {

    const classNames = classnames(
        'ascent',
        type ? `ascent--${type}` : null,
        checked ? 'ascent--checked' : null,
        disabled ? 'ascent--disabled' : null
    );

    const icon = <Icon name={type} fill={checked ? null : "#333"}/>;

    return <div className={classNames} {...rest}>
        {icon}
    </div>
};

export default Ascent;