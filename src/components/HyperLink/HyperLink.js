import React from 'react';
import classnames from "classnames";
import "./HyperLink.css";

const HyperLink = ({children, light, active, href, ...rest}) => {
    const classes = classnames("hyperlink", active ? "hyperlink--active" : null, light ? "hyperlink--light" : null);

    if (href) {
        return <a {...rest} href={href} className={classes}>
            {children}
        </a>
    }

    return <span {...rest} className={classes}>
        {children}
    </span>
};

export default HyperLink