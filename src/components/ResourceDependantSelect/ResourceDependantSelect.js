import React, { Fragment, useState } from "react";
import { useQuery } from "react-query";
import { queryDefaults, useApi } from "../../hooks/useApi";
import { Select } from "../Select/Select";
import { Input } from "../Input/Input";
import styles from "./ResourceDependantSelect.module.css";
import { joinClassNames } from "../../helper/classNames";
import typography from "../../css/typography.module.css";
import { Close } from "../Icon/Close";

const ResourceDependantSelect = ({
  cacheKey,
  api,
  labelProperty,
  valueProperty = "id",
  searchable = false,
  ...rest
}) => {
  const resource = useApi(api);
  const { status, data } = useQuery(cacheKey, resource, queryDefaults);

  const [search, setSearch] = useState("");

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
      {searchable && (
        <div className={styles.search}>
          <input
            placeholder={"search"}
            className={styles.searchInput}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
            }}
          />

          {search.length > 0 && (
            <span className={styles.clearSearch} onClick={() => setSearch("")}>
              <Close />
            </span>
          )}
        </div>
      )}

      <Select {...rest}>
        <option value="">--</option>

        {data &&
          data.map((item) => {
            let match = true;

            if (searchable && search.length > 0) {
              match = item[labelProperty]
                .toLowerCase()
                .includes(search.toLowerCase());
            }

            if (item instanceof Object) {
              return (
                <option
                  value={item[valueProperty]}
                  key={item[valueProperty]}
                  className={joinClassNames(
                    styles.option,
                    !match ? styles.hiddenOptions : null
                  )}
                >
                  {item[labelProperty]}
                </option>
              );
            }

            return (
              <option
                value={item}
                key={item}
                className={joinClassNames(
                  styles.option,
                  !match ? styles.hiddenOptions : null
                )}
              >
                {item}
              </option>
            );
          })}
      </Select>
    </Fragment>
  );
};

export default ResourceDependantSelect;
