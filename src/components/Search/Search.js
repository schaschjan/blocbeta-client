import React, { useRef } from "react";
import Input from "../Input/Input";
import "./Search.css";
import { Close } from "../Icon/Close";
import { Search as SearchIcon } from "../Icon/Search";

const Search = ({ placeholder, onChange, onClear, value, ...rest }) => {
  const inputElement = useRef(null);

  return (
    <div className="search" {...rest}>
      <SearchIcon onClick={() => inputElement.current.focus()} />

      <Input
        register={inputElement}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />

      {inputElement.current && inputElement.current.value && (
        <Close
          onClick={() => {
            inputElement.current.value = null;
            onClear();
          }}
        />
      )}
    </div>
  );
};

export default Search;
