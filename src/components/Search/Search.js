import React from 'react';
import './Search.css';
import Icon from "../Icon/Icon";
import Input from "../Input/Input";

const Search = ({placeholder}) => {

	return <div className="search">
		<Icon name="search"/>
		<Input placeholder={placeholder}/>
	</div>
};


export default Search