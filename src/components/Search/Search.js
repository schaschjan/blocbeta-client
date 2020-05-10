import React, { useRef } from "react";
import "./Search.css";
import Icon from "../Icon/Icon";
import Input from "../Input/Input";
import { Tag } from "../TagInput/TagInput";

const Search = ({
  placeholder,
  onInputChange,
  onClear,
  value,
  tags,
  onTagRemove,
  onToggle,
  ...rest
}) => {
  const inputElement = useRef(null);

  return (
    <div className="search" {...rest}>
      <Icon name="search" onClick={() => inputElement.current.focus()} />

      {tags &&
        tags.map((tag) => (
          <Tag id={tag.id} value={tag.value} onRemove={onTagRemove} />
        ))}

      <Input
        register={inputElement}
        placeholder={placeholder}
        onChange={onInputChange}
        value={value}
      />

      <Icon
        name="open-filters-small"
        className="toggle-filter-dropdown"
        onClick={() => onToggle()}
      />

      {inputElement.current && inputElement.current.value && (
        <Icon
          name="close"
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
