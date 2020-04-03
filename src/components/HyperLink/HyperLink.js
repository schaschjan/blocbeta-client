import React from 'react';
import classnames from "classnames";
import "./HyperLink.css";

const HyperLink = ({children, active, href, ...rest}) => {
    if (href) {
        return <a {...rest} href={href} className={classnames("hyperlink", active ? "hyperlink--active" : null)}>
            {children}
        </a>
    }

    return <span {...rest} className={classnames("hyperlink", active ? "hyperlink--active" : null)}>
        {children}
    </span>
};

export default HyperLink