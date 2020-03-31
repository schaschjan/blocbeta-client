import React from 'react';
import './TagInput.css';
import Icon from "../Icon/Icon";

export const TagInput = ({children}) => {
    return (
        <div className="tags">
            {children}
        </div>
    )
};

export const Tag = ({id, value, onRemove}) => {
    return <span className="tag">
        {value}
        <Icon name="close" onClick={() => onRemove(id)}/>
    </span>
};