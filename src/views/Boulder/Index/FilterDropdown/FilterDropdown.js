import React, { useState } from "react";
import "./FilterDropdown.css";
import HoldStyle from "../../../../components/HoldStyle/HoldStyle";
import HyperLink from "../../../../components/HyperLink/HyperLink";
import Emoji from "../../../../components/Emoji/Emoji";
import Grade from "../../../../components/Grade/Grade";
import Icon from "../../../../components/Icon/Icon";
import classnames from "classnames";
import useApi, { api, cacheKeys } from "../../../../hooks/useApi";
import { store } from "../../../../store";
import { alphaSort } from "../../../../helpers";

export const FilterDropdown = ({ addFilter, dropped, ...rest }) => {
  const [activeTab, setActiveTab] = useState("holdStyle");

  const { data: walls } = useApi(cacheKeys.walls, api.walls.all);
  const { data: grades } = useApi(cacheKeys.grades, api.grades.all);
  const { data: holdStyles } = useApi(cacheKeys.holdStyles, api.holdStyles.all);
  const { data: tags } = useApi(cacheKeys.tags, api.tags.all);
  const { data: labels } = useApi(cacheKeys.labels, api.labels.all);

  const { data: setters } = useApi(
    [cacheKeys.setters, "withActiveBoulders"],
    api.setters.withActiveBoulders
  );

  const isActive = (tabName) => {
    return tabName === activeTab;
  };

  const tabs = [
    {
      id: "holdStyle",
      label: "Hold Style",
      render: () => {
        return (
          <ul className="filter-values">
            {alphaSort(holdStyles, "name").map((holdStyle, index) => {

              return (
                <li className="filter-option" key={index}>
                  <span onClick={() => addFilter("holdStyle", holdStyle.name)}>
                    <HoldStyle
                      name={holdStyle.name}
                      icon={holdStyle.icon}
                      small={true}
                    />
                    <span>{holdStyle.name}</span>
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
            {alphaSort(grades, "name").map((grade,index) => {
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
            {labels.sort().map((label,index) => {
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
