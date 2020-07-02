import React from "react";
import "./TagInput.css";
import Icon from "../Icon/Icon";
import Button from "../Button/Button";

export const TagInput = ({ children, onClear }) => {
  return (
    <div className="tags">
      {children}

      {children.length > 0 && (
        <Button className="clear-tags" text={true} onClick={() => onClear()}>
          Clear all
        </Button>
      )}
    </div>
  );
};

export const Tag = ({ id, value, onRemove, ...rest }) => {
  return (
    <span className="tag" {...rest}>
      {value}
      <Icon name="close" onClick={() => onRemove(id, value)} />
    </span>
  );
};
