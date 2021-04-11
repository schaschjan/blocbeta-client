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
  return (
    <Autocomplete
      options={options}
      autoHighlight
      value={value}
      multiple={multiple}
      {...rest}
      renderInput={(params) => (
        <TextField
          required={multiple ? value.length === 0 : required}
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
