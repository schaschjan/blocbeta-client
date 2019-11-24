import React from 'react';

export default function Button(props) {

    let classNames = 'button';

    if (props.className) {
        classNames += ` ${props.className}`;
    }

    if (props.type) {
        classNames += ` button--${props.type}`;
    }

    return (
        <div className={classNames}>
            {props.children}
        </div>
    )
}