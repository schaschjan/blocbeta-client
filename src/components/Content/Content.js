import React, {Fragment} from 'react';
import {useDrawerState} from "../../helpers/drawer.state";
import classnames from "classnames";
import Drawer from "../Drawer/Drawer";
import {ToastContainer} from "react-toastify";
import "./Content.css";

export const Content = ({children}) => {
    const {open, toggle, close, header, content} = useDrawerState();

    return <Fragment>
        <div onClick={() => close()}
            className={classnames("content", open ? "content--disabled" : null)}>
            {children}
        </div>

        <Drawer open={open}
                closeHandler={toggle}
                header={header}
                content={content}/>

        <ToastContainer/>
    </Fragment>
};