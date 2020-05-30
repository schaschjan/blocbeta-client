import classnames from "classnames";
import React from "react";
import "./Progress.css";

const Progress = ({ percentage }) => {
    const classes = classnames(
        "progress",
        percentage > 66
            ? "progress--success"
            : percentage > 33
            ? "progress--warning"
            : "progress--danger"
    );

    return (
        <div className={classes}>
            <div style={{ width: `${percentage}%` }} />
        </div>
    );
};

export default Progress