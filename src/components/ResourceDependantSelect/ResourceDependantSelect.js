import React from "react";
import { useQuery } from "react-query";
import { queryDefaults, useApi } from "../../hooks/useApi";
import { Option, StyledSelect } from "../Select/Select";
import { Loader } from "../Loader/Loader";

const ResourceDependantSelect = ({
  cacheKey,
  api,
  labelProperty,
  valueProperty = "id",
  childrenRenderer = null,
  ...rest
}) => {
  const resource = useApi(api);
  const { status, data } = useQuery(cacheKey, resource, queryDefaults);

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <StyledSelect {...rest}>
      {data.map((option) => (
        <Option value={option[valueProperty]} label={option[labelProperty]}>
          {childrenRenderer ? childrenRenderer(option) : null}
        </Option>
      ))}
    </StyledSelect>
  );
};

export default ResourceDependantSelect;
