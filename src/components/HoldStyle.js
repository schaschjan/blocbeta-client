import React from 'react';

export default function HoldStyle(props) {
    let icon;

    if (props.name === 'blue' || props.name === 'blau') {
        icon = <div style={{background: "#28C6FF", width: '100%', height: '100%'}}></div>
    }

    if (props.name === 'red' || props.name === 'rot') {
        icon = <div style={{background: "#FF5D5F", width: '100%', height: '100%'}}></div>
    }

    if (props.name === 'green' || props.name === 'grün') {
        icon = <div style={{background: "#B9F379", width: '100%', height: '100%'}}></div>
    }

    if (props.name === 'yellow' || props.name === 'gelb') {
        icon = <div style={{background: "#F8E71C", width: '100%', height: '100%'}}></div>
    }

    return <div className={`holdstyle holdstyle--${props.name}`}>
        {icon}
    </div>
}