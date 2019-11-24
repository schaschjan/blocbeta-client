import React from 'react';
import useForm from 'react-hook-form';

export function Field(props) {

    return (
        <>
            <input
                type={props.type}
                name="email"
                ref={props.validation}
            />
            {props.error && props.error.message}
        </>
    )
}