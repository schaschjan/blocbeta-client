import React, { useMemo } from "react";
import { Close } from "../Icon/Close";
import Grade from "../Grade/Grade";
import HoldType from "../HoldStyle/HoldType";
import { Input } from "../Input/Input";
import styles from "./BoulderFilters.module.css";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";
import { AscentIcon } from "../Ascent/Ascent";

const Filter = ({ name, items = [], onSelect, renderItem }) => {
  return useMemo(() => {
    return (
      <div className={styles.filter}>
        <span className={joinClassNames(typography.gamma, styles.filterName)}>
          {name}
        </span>

        <ul className={styles.filterOptions}>
          {items.length > 0 ? (
            items.map((item, index) => {
              return (
                <li
                  key={index}
                  className={styles.filterOptionsItem}
                  onClick={() => onSelect(item)}
                >
                  {renderItem(item)}
                </li>
              );
            })
          ) : (
            <li>loading...</li>
          )}
        </ul>
      </div>
    );
  }, [items, onSelect]);
};

const GlobalFilter = ({
  globalFilter,
  setGlobalFilter,
  filters,
  setFilters,
}) => {
  return useMemo(() => {
    return (
      <Input
        className={styles.search}
        placeholder="Search"
        value={globalFilter}
        onClear={() => setGlobalFilter("")}
        onChange={(event) => {
          setGlobalFilter(event.target.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Backspace") {
            filters.pop();
            setFilters([...filters]);
          }
        }}
      >
        {filters.map((filter, index) => {
          return (
            <span key={index}>
              <FilterTag
                id={filter.id}
                value={filter.value}
                onClick={() =>
                  setFilters([
                    ...filters.filter(
                      (activeFilter) => activeFilter.id !== filter.id
                    ),
                  ])
                }
              />
            </span>
          );
        })}
      </Input>
    );
  }, [filters, globalFilter]);
};

const holdTypeFilterProps = {
  label: "Hold type",
  renderOption: (option) => (
    <div className={styles.isHoldTypeFilterOptionsItem}>
      <HoldType image={option.image} small={true} /> {option.name}
    </div>
  ),
  getOptionLabel: (option) => option.name,
};

const gradeFilterProps = {
  label: "Grade",
  renderOption: (option) => (
    <Grade
      color={option.color}
      name={option.name}
      internalName={option.internalName}
    />
  ),
  getOptionLabel: (option) => option.name,
};

const setterFilterProps = {
  label: "Setter",
  renderOption: (option) => option.username,
  getOptionLabel: (option) => option.username,
};

const wallFilterProps = {
  renderOption: (option) => option.name,
  getOptionLabel: (option) => option.name,
};

const ascentFilterProps = {
  label: "Ascent",
  options: [
    {
      value: "todo",
      label: "Todo",
    },
    {
      value: "flash",
      label: "Flash",
    },
    {
      value: "top",
      label: "Top",
    },
    {
      value: "resignation",
      label: "Resignation",
    },
  ],
  renderOption: (option) => (
    <div className={styles.isHoldTypeFilterOptionsItem}>
      <AscentIcon type={option.label} fill={true} /> {option.label}
    </div>
  ),
  getOptionLabel: (option) => option.value,
};

const FilterTag = ({ id, value, onClick }) => {
  return (
    <div className={joinClassNames(typography.eta, styles.tag)}>
      <strong>{id}:</strong>&nbsp;{value}
      <span className={styles.removeTag}>
        {" "}
        {onClick ? <Close onClick={onClick} /> : null}
      </span>
    </div>
  );
};

export {
  Filter,
  GlobalFilter,
  holdTypeFilterProps,
  gradeFilterProps,
  wallFilterProps,
  setterFilterProps,
  ascentFilterProps,
};
