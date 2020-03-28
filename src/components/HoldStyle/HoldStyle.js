import React from 'react';
import './HoldStyle.css';
import classnames from "classnames";

const HoldStyle = ({name, small}) => {
    let icon = <div style={{background: "#fea4e1"}}></div>;

    if (name === 'blau') {
        icon = <div style={{background: "#44A9FF"}}></div>
    }

    if (name === 'rot') {
        icon = <div style={{background: "#FF625F"}}></div>
    }

    if (name === 'grün') {
        icon = <div style={{background: "#129C07"}}></div>
    }

    if (name === 'gelb') {
        icon = <div style={{background: "#FFF695"}}></div>
    }

    if (name === 'gelb neon') {
        icon = <div style={{background: "#FFFF00"}}></div>
    }

    if (name === 'lila') {
        icon = <div style={{background: "#BE78FC"}}></div>
    }

    if (name === 'pink') {
        icon = <div style={{background: "#FE28FF"}}></div>
    }

    if (name === 'orange') {
        icon = <div style={{background: "#FFB741"}}></div>
    }

    if (name === 'schwarz') {
        icon = <div style={{background: "#000000"}}></div>
    }

    if (name === 'weiß') {
        icon = <div style={{background: "#eeeeee"}}></div>
    }

    if (name === 'braun') {
        icon = <div style={{background: "#8B572A"}}></div>
    }

    return <div className={classnames("holdstyle", ``, small ? "holdstyle--small" : null)}>
        {icon}
    </div>
};

export default HoldStyle;