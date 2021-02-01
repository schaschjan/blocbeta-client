import React, {useState} from "react";
import styles from "./Ascent.module.css";
import Flash from "../Icon/Flash";
import Top from "../Icon/Top";
import Resignation from "../Icon/Resignation";
import {classNames} from "../../helper/classNames";
import Todo from "../Icon/Todo";

const icons = {
    top: Top,
    flash: Flash,
    resignation: Resignation,
    todo: Todo,
};

const getIcon = (type) => {
    return icons[type];
};

const Ascent = ({type, checked, disabled, asyncHandler, ...rest}) => {
    const [loading, setLoading] = useState(false);

    return (
        <div
            onClick={async () => {
                setLoading(true);
                await asyncHandler();
                setLoading(false);
            }}
            className={`
                ${styles.root} 
                ${type ? styles[`root--${type}`] : ""}
                ${checked ? styles[`root--checked`] : ""}
                ${disabled ? styles[`root--disabled`] : ""}
                ${loading ? styles[`root--loading`] : ""}
            `}
            {...rest}
        >
            {React.createElement(icons[type], {
                fill: checked,
            })}
        </div>
    );
};

export {Ascent, getIcon};
