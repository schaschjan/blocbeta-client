import React from 'react';
import './Ascent.css';
import Icon from "../Icon/Icon";
import classnames from "classnames";

const Ascent = ({type, handler, checked}) => {
    let icon = <Icon name={type}/>;

    return <div className={classnames('ascent', type ? `ascent--${type}` : null, checked ? 'ascent--checked' : null)}
                onClick={handler}>
        {icon}
    </div>
};

export default Ascent;