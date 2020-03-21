import React from 'react';
import './TagInput.css';
import Icon from "../Icon/Icon";
import Input from "../Input/Input";

export const TagInput = ({tags, onAdd, onRemove}) => {
    return (
        <div className="tags">
            {tags.map(tag => {
                return (
                    <Tag id={tag.id} value={tag.value} onRemove={onRemove}/>
                )
            })}

            <Input name="search"/>
        </div>
    )
};

export const Tag = ({id, value, onRemove}) => {
    return <span className="tag">
        {value}
        <Icon name="close" onClick={() => onRemove(id)}/>
    </span>
};