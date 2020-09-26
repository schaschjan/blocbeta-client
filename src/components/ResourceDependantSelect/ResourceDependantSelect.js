import React, {Fragment} from "react";
import {useQuery} from "react-query";
import Select from "../Select/Select";
import axios from "axios";

const ResourceDependantSelect = ({
                                   cacheKey,
                                   apiResource,
                                   labelProperty,
                                   valueProperty = "id",
                                   ...rest
                                 }) => {
  const {status, data} = useQuery(cacheKey, () => axios.get(apiResource));

  if (status === "loading") {
    return (
      <Select selected="">
        <option value="">Loading options…</option>
      </Select>
    );
  }

  return (
    <Fragment>
      <Select {...rest}>
        <option value="">--</option>
        {data.data.map((item) => {
          if (item instanceof Object) {
            return (
              <option value={item[valueProperty]} key={item[valueProperty]}>
                {item[labelProperty]}
              </option>
            );
          }

          return (
            <option value={item} key={item}>
              {item}
            </option>
          );
        })}
      </Select>
    </Fragment>
  );
};

export default ResourceDependantSelect;
