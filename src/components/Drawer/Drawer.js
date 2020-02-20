import React from 'react';
import './Drawer.css';
import classnames from "classnames";
import Button from "../Button/Button";
import Icon from "../Icon/Icon";

const Drawer = ({open, children, closeHandler}) => {
    const classes = classnames("drawer", open ? "drawer--open" : "drawer--closed");

    // window.addEventListener('keydown', (event) => {
    //     if (event.key == "Escape") {
    //         closeHandler()
    //     }
    // });

    return (
        <div className={classes}>
            {children}

            <Button type="text" onClick={() => closeHandler()} className="close-drawer">
                <Icon name="error"/>
            </Button>
        </div>
    )
};

export default Drawer;