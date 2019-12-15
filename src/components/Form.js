import React from 'react';

export function Input(props) {

    return (
        <>
            <input
                id={props.name}
                name={props.name}
                placeholder={props.name}
                className="form-field"
                type={props.type}
                ref={props.ref}
            />
            {props.error &&
            <span className="form-error">{props.error}</span>
            }
        </>
    )
}