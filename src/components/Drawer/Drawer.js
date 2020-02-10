import React from 'react';
import './Drawer.css';
import classnames from "classnames";

const Drawer = ({open, children}) => {
    const classes = classnames("drawer", open ? "drawer--open" : "drawer--closed");

    return (
        <div className={classes}>
            {children}
        </div>
    )
};

export default Drawer;