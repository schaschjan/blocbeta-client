import React, { useMemo } from "react";
import { Close } from "../Icon/Close";
import Grade from "../Grade/Grade";
import HoldType from "../HoldStyle/HoldType";
import { Input } from "../Input/Input";
import "./BoulderFilters.css";

const Filter = ({ name, items = [], onSelect, renderItem }) => {
  return useMemo(() => {
    return (
      <div className={"filter"}>
        <span className={"t--gamma filter__name"}>{name}</span>

        <ul className={"filter__items filter-items"}>
          {items.length > 0 ? (
            items.map((item, index) => {
              return (
                <li
                  key={index}
                  className={"filter-items__item"}
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
        className={"boulder-filters__search"}
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
  name: "Hold types",
  id: "holdType",
  valueProperty: "name",
  renderItem: (item) => (
    <div className={"hold-type-filter-item"}>
      <HoldType image={item.image} small={true} /> {item.name}
    </div>
  ),
};

const gradeFilterProps = {
  name: "Grade",
  id: "grade",
  valueProperty: "name",
  renderItem: (item) => (
    <Grade
      color={item.color}
      name={item.name}
      internalName={item.internalName}
    />
  ),
};

const setterFilterProps = {
  name: "Setter",
  id: "setter",
  valueProperty: "username",
  renderItem: (item) => item.username,
};

const wallFilterProps = {
  valueProperty: "name",
  renderItem: (item) => item.name,
};

const ascentFilterProps = {
  name: "Ascent",
  id: "ascent",
  valueProperty: "value",
  items: [
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
  renderItem: (item) => item.label,
};

const FilterTag = ({ id, value, onClick }) => {
  return (
    <div className={"filter-tag t--eta"}>
      <strong>{id}:</strong>&nbsp;{value}
      {onClick ? <Close onClick={onClick} /> : null}
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
