import React from 'react';
import classnames from "classnames";
import "./HyperLink.css";

const HyperLink = ({children, active, ...rest}) => {
    return <span {...rest} className={classnames("hyperlink", active ? "hyperlink--active" : null)}>{children}</span>
};

export default HyperLink