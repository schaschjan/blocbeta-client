import React from "react";
import "./BoulderFilters.css";
import { Close } from "../Icon/Close";
import { cache, queryDefaults, useApi } from "../../hooks/useApi";
import { useQuery } from "react-query";
import { Loader } from "../Loader/Loader";
import Grade from "../Grade/Grade";
import HoldType from "../HoldStyle/HoldType";
import { Input } from "../Input/Input";

const Filter = ({
  name,
  id,
  query,
  valueProperty,
  currentFilters,
  setFilters,
  renderItem,
}) => {
  const { status, data } = query;

  if (status !== "success") {
    return <Loader />;
  }

  return (
    <div className={"filter"}>
      <span className={"t--gamma filter__name"}>{name}</span>

      <ul className={"filter__items filter-items"}>
        {data.map((item, index) => {
          return (
            <li
              key={index}
              className={"filter-items__item"}
              onClick={() => {
                let current = currentFilters.filter(
                  (currentFilter) => currentFilter.id !== id
                );

                current.push({
                  id,
                  value: item[valueProperty],
                });

                setFilters([...current]);
              }}
            >
              {renderItem(item)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const BoulderFilters = ({
  filters,
  setFilters,
  globalFilter,
  setGlobalFilter,
}) => {
  return (
    <div className={"boulder-filters"}>
      <div className={"boulder-filters__list"}>
        <Filter
          name={"Hold types"}
          id={"holdType"}
          query={useQuery(cache.holdTypes, useApi("holdTypes"), queryDefaults)}
          valueProperty={"name"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return (
              <div className={"hold-type-filter-item"}>
                <HoldType image={item.image} small={true} /> {item.name}
              </div>
            );
          }}
        />

        <Filter
          name={"Grade"}
          id={"grade"}
          query={useQuery(cache.grades, useApi("grades"), queryDefaults)}
          valueProperty={"name"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return (
              <Grade
                color={item.color}
                name={item.name}
                internalName={item.internalName}
              />
            );
          }}
        />

        <Filter
          name={"Start"}
          id={"start"}
          query={useQuery(cache.walls, useApi("walls"), queryDefaults)}
          valueProperty={"name"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return item.name;
          }}
        />

        <Filter
          name={"End"}
          id={"end"}
          query={useQuery(cache.walls, useApi("walls"), queryDefaults)}
          valueProperty={"name"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return item.name;
          }}
        />

        <Filter
          name={"Ascent"}
          id={"ascent"}
          query={{
            status: "success",
            data: [
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
          }}
          valueProperty={"value"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return item.label;
          }}
        />
      </div>

      <Input
        className={"boulder-filters__search"}
        placeholder="Search"
        value={globalFilter}
        onClear={() => setGlobalFilter("")}
        onChange={(event) => {
          setGlobalFilter(event.target.value);
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
    </div>
  );
};

const FilterTag = ({ id, value, onClick }) => {
  return (
    <div className={"filter-tag t--eta"}>
      <strong>{id}:</strong>&nbsp;{value}
      {onClick ? <Close onClick={onClick} /> : null}
    </div>
  );
};

export { BoulderFilters, FilterTag };
