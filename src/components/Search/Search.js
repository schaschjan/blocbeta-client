import React, {useRef} from 'react';
import './Search.css';
import Icon from "../Icon/Icon";
import Input from "../Input/Input";

const Search = ({placeholder, onInputChange, onClear, value}) => {

    const inputElement = useRef(null);

    return <div className="search">
        <Icon name="search" onClick={() => inputElement.current.focus()}/>

        <Input register={inputElement}
               placeholder={placeholder}
               onChange={onInputChange}
               value={value}/>

        {inputElement.current && inputElement.current.value && (
            <Icon name="close" onClick={() => {
                inputElement.current.value = null;
                onClear();
            }}/>
        )}
    </div>
};


export default Search