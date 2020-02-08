import React from 'react';
import './Search.css';
import Icon from "../Icon/Icon";
import Input from "../Input/Input";

const Search = ({placeholder, onInputChange, value}) => {

    return <div className="search">
        <Icon name="search"/>
        <Input placeholder={placeholder} onChange={onInputChange} value={value}/>
    </div>
};


export default Search