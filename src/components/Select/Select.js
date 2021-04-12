import { Autocomplete } from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import React from "react";

function Select({
  label,
  multiple = false,
  value,
  options,
  required,
  ...rest
}) {
  let isRequired = required;

  if (multiple && required) {
    isRequired = value.length === 0;
  }

  return (
    <Autocomplete
      options={options}
      autoHighlight
      value={value}
      multiple={multiple}
      {...rest}
      renderInput={(params) => (
        <TextField
          required={isRequired}
          {...params}
          label={label}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password",
          }}
        />
      )}
    />
  );
}

export { Select };
