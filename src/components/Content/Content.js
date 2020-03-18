import React, {Fragment} from 'react';
import {ToastContainer} from "react-toastify";
import "./Content.css";
import classnames from "classnames";

export const Content = ({children, disabled, ...rest}) => {
    return <Fragment>
        <div id="content"
             {...rest}
             className={classnames("content", disabled ? "content--disabled" : false)}>
            {children}
        </div>

        <ToastContainer/>
    </Fragment>
};