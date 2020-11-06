import React, {Fragment} from "react";
import {useQuery} from "react-query";
import {useApi} from "../../hooks/useApi";
import {Select} from "../Select/Select";

const ResourceDependantSelect = ({cacheKey, api, labelProperty, valueProperty = "id", ...rest}) => {
  const resource = useApi(api);
  const {status, data} = useQuery(cacheKey, resource);

  if (status === "loading") {
    return (
      <Fragment>
        <Select selected="loading">
          <option value="loading">Fetching options…</option>
        </Select>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Select {...rest}>
        <option value="">--</option>
        {data && data.map((item) => {
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
