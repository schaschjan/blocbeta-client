import React from "react";
import ReactSelect, { components } from "react-select";
import { Controller } from "react-hook-form";
import "./Select.css";
import Icon from "../Icon/Icon";

const Select = ({
  options,
  control,
  multiple = false,
  clearable = false,
  formChild = true,
  validate,
  ...rest
}) => {
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <Icon name="downward" />
      </components.DropdownIndicator>
    );
  };

  if (!formChild) {
    return (
      <ReactSelect
        components={DropdownIndicator}
        clearable={clearable}
        options={options}
        className="react-select react-select--formless"
        classNamePrefix="react-select"
      />
    );
  }

  return (
    <Controller
      as={
        <ReactSelect
          components={DropdownIndicator}
          clearable={clearable}
          className="react-select"
          {...rest}
          classNamePrefix="react-select"
        />
      }
      options={options}
      rules={validate}
      control={control}
      {...rest}
    />
  );
};

export default Select;
