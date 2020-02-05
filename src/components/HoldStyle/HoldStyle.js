import React from 'react';
import './HoldStyle.css';

const HoldStyle = ({name}) => {
    let icon = <div style={{background: "#28C6FF"}}></div>;

    if (name === 'blue' || name === 'blau') {
        icon = <div style={{background: "#28C6FF"}}></div>
    }

    if (name === 'red' || name === 'rot') {
        icon = <div style={{background: "#FF5D5F"}}></div>
    }

    if (name === 'green' || name === 'grün') {
        icon = <div style={{background: "#B9F379"}}></div>
    }

    if (name === 'yellow' || name === 'gelb') {
        icon = <div style={{background: "#F8E71C"}}></div>
    }

    return <div className={`holdstyle holdstyle--${name}`}>
        {icon}
    </div>
};

export default HoldStyle;