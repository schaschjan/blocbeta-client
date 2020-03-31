import React, {Fragment} from 'react';
import "./Content.css";
import classnames from "classnames";

export const Content = ({children, disabled, ...rest}) => {
    return <Fragment>
        <div id="content" className={classnames("content", disabled ? "content--disabled" : false)} {...rest} >
            {children}
        </div>
    </Fragment>
};