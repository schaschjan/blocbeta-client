import React from 'react';

export default function Button(props) {

    let classNames = 'button';

    if (props.className) {
        classNames += ` ${props.className}`;
    }

    if (props.type) {
        classNames += ` button--${props.type}`;
    }

    if (props.disabled) {
        classNames += ' button--disabled';
    }

    return <div className={classNames}>{props.children}</div>
}