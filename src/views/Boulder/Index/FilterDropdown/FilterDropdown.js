import React, { useState } from "react";
import "./FilterDropdown.css";
import HoldStyle from "../../../../components/HoldStyle/HoldStyle";
import HyperLink from "../../../../components/HyperLink/HyperLink";
import Emoji from "../../../../components/Emoji/Emoji";
import Grade from "../../../../components/Grade/Grade";
import Icon from "../../../../components/Icon/Icon";
import useApi, { api, cache } from "../../../../hooks/useApi";
import { store } from "../../../../store";
import { alphaSort } from "../../../../helpers";

export const FilterDropdown = ({ addFilter, dropped, ...rest }) => {
  const [activeTab, setActiveTab] = useState("holdType");

  const { data: walls } = useApi(cache.walls, api.walls.all);
  const { data: grades } = useApi(cache.grades, api.grades.all);
  const { data: holdTypes } = useApi(cache.holdTypes, api.holdTypes.all);
  const { data: tags } = useApi(cache.tags, api.tags.all);
  const { data: labels } = useApi(cache.labels, api.labels.all);

  const { data: setters } = useApi(
    [cache.setters, "withActiveBoulders"],
    api.setters.withActiveBoulders
  );

  const isActive = (tabName) => {
    return tabName === activeTab;
  };

  const tabs = [
    {
      id: "holdType",
      label: "Hold Style",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(holdTypes, "name").map((holdType, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("holdType", holdType.name)}>
                    <HoldStyle
                      name={holdType.name}
                      icon={holdType.icon}
                      small={true}
                    />
                    <span>{holdType.name}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      id: "start",
      label: "Start",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(walls, "name").map((wall, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("start", wall.name)}>
                    <span>{wall.name}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      id: "end",
      label: "End",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(walls, "name").map((wall, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("end", wall.name)}>
                    <span>{wall.name}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      id: "grade",
      label: "Grade",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(grades, "name").map((grade, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("grade", grade.name)}>
                    <Grade name={grade.name} color={grade.color} />
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      id: "tag",
      label: "Tag",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(tags, "name").map((tag, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("tag", tag.emoji)}>
                    <Emoji>{tag.emoji}</Emoji> {tag.name}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      id: "setter",
      label: "Setter",
      render: () => {
        return (
          <ul className="filter-values">
            {setters
              .sort((a, b) => b.boulders - a.boulders)
              .map((setter, index) => {
                return (
                  <li className="filter-option" key={index}>
                    <span onClick={() => addFilter("setters", setter.username)}>
                      {setter.username} ({setter.boulders})
                    </span>
                  </li>
                );
              })}
          </ul>
        );
      },
    },
    {
      id: "ascent",
      label: "Ascent",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(store.ascents, "name").map((ascent, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("ascent", ascent.name)}>
                    <Icon name={ascent.id} /> {ascent.name}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
    {
      id: "label",
      label: "Label",
      render: () => {
        return (
          <ul className="filter-values">
            {labels.sort().map((label, index) => {
              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("labels", label)}>
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>
        );
      },
    },
  ];

  return (
    <div
      className={classnames(
        "filter-dropdown",
        dropped ? "filter-dropdown--dropped" : null
      )}
      {...rest}
    >
      <div className="filter-tabs">
        <ul className="tab-nav">
          {tabs.map((tab) => {
            return (
              <li className="tab-nav-item" key={tab.id}>
                <HyperLink
                  active={isActive(tab.id)}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </HyperLink>
              </li>
            );
          })}
        </ul>

        <div className="tab-content">
          {tabs.find((tab) => tab.id === activeTab).render()}
        </div>
      </div>
    </div>
  );
};
