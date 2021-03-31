import React from "react";
import "./BoulderFilters.css";
import { Close } from "../Icon/Close";
import Grade from "../Grade/Grade";
import HoldType from "../HoldStyle/HoldType";
import { Input } from "../Input/Input";
import useRequest from "../../hooks/useRequest";
import { Loader } from "../Loader/Loader";

const Filter = ({
  name,
  id,
  data,
  itemFilter = () => true,
  valueProperty,
  currentFilters,
  setFilters,
  renderItem,
}) => {
  return (
    <div className={"filter"}>
      <span className={"t--gamma filter__name"}>{name}</span>

      <ul className={"filter__items filter-items"}>
        {data
          .filter((item) => itemFilter(item))
          .map((item, index) => {
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
  const { data: holdTypes } = useRequest("/holdstyle");
  const { data: grades } = useRequest("/grade");
  const { data: walls } = useRequest("/wall");
  const { data: setters } = useRequest("/setter/current");
  const ascents = [
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
  ];

  if (!holdTypes || !grades || !walls || !setters || !ascents) {
    return <Loader />;
  }

  return (
    <div className={"boulder-filters"}>
      <div className={"boulder-filters__list"}>
        <Filter
          name={"Hold types"}
          id={"holdType"}
          data={holdTypes ? holdTypes : []}
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
          data={grades ? grades : []}
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
          data={walls ? walls : []}
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
          data={walls ? walls : []}
          valueProperty={"name"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return item.name;
          }}
        />

        <Filter
          name={"Setter"}
          id={"setter"}
          data={setters ? setters : []}
          valueProperty={"username"}
          setFilters={setFilters}
          currentFilters={filters}
          renderItem={(item) => {
            return item.username;
          }}
        />

        <Filter
          name={"Ascent"}
          id={"ascent"}
          data={ascents ? ascents : []}
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
