import React from 'react';
import './Ascent.css';
import Icon from "../Icon/Icon";
import classnames from "classnames";

const Ascent = ({type, handler, checked, disabled}) => {
    let icon = <Icon name={type}/>;

    const classNames = classnames(
        'ascent',
        type ? `ascent--${type}` : null,
        checked ? 'ascent--checked' : null,
        disabled ? 'ascent--disabled' : null
    );

    return <div className={classNames}
                onClick={handler}>
        {icon}
    </div>
};

export default Ascent;