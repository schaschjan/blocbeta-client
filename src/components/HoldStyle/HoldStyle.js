import React from 'react';
import './HoldStyle.css';
import classnames from "classnames";

const HoldStyle = ({name, small}) => {
    let icon = <div style={{background: "#28C6FF"}}></div>;

    if (name === 'blue' || name === 'blau') {
        icon = <div style={{background: "#28C6FF"}}></div>
    }

    if (name === 'red' || name === 'rot') {
        icon = <div style={{background: "#FF625F"}}></div>
    }

    if (name === 'green' || name === 'grün') {
        icon = <div style={{background: "#129C07"}}></div>
    }

    if (name === 'yellow' || name === 'gelb') {
        icon = <div style={{background: "#FFF695"}}></div>
    }

    if (name === 'pink') {
        icon = <div style={{background: "#FE28FF"}}></div>
    }

    if (name === 'orange') {
        icon = <div style={{background: "#FFB741"}}></div>
    }

    if (name === 'black' || name === 'schwarz') {
        icon = <div style={{background: "#000000"}}></div>
    }

    if (name === 'white' || name === 'weiß') {
        icon = <div style={{background: "#eeeeee"}}></div>
    }

    return <div className={ classnames("holdstyle", `holdstyle--${name}`, small ? "holdstyle--small": null)}>
        {icon}
    </div>
};

export default HoldStyle;