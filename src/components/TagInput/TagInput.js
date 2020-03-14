import React from 'react';
import './TagInput.css';
import Icon from "../Icon/Icon";

export const TagInput = ({tags, onAdd, onRemove}) => {
    return (
        <div className="tags">
            {tags.map(tag => {
                return (
                    <Tag id={tag.id} value={tag.value} onRemove={onRemove}/>
                )
            })}
        </div>
    )
};

export const Tag = ({id, value, onRemove}) => {
    return <span className="tag">
        {value}
        <Icon name="close" onClick={() => onRemove(id)}/>
    </span>
};