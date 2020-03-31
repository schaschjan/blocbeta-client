import React, {useState} from 'react';
import "./FilterDropdown.css";
import Context from "../../../../Context";
import Container from "../../../../components/Container/Container";
import HoldStyle from "../../../../components/HoldStyle/HoldStyle";
import {alphabeticalSort} from "../../../../Helpers";
import HyperLink from "../../../../components/HyperLink/HyperLink";
import Emoji from "../../../../components/Emoji/Emoji";
import Grade from "../../../../components/Grade/Grade";
import Icon from "../../../../components/Icon/Icon";
import classnames from "classnames";

export const FilterDropdown = ({onAddFilter, dropped}) => {
    const [activeTab, setActiveTab] = useState("holdStyle");

    const isActive = (tabName) => {
        return tabName === activeTab
    };

    const tabs = [
        {
            id: "holdStyle",
            label: "Hold Style",
            render: () => {
                return (
                    <ul className="filter-values">
                        {Context.storage.holdStyles.all().sort((a, b) => alphabeticalSort(a.name, b.name)).map(holdStyle => {
                            return (
                                <li className="filter-option">
                                    <span onClick={() => onAddFilter('holdStyle', holdStyle.name)}>
                                        <HoldStyle name={holdStyle.name} small={true}/>
                                        <span>{holdStyle.name}</span>
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        },
        {
            id: "start",
            label: "Start",
            render: () => {
                return (
                    <ul className="filter-values">
                        {Context.storage.walls.all().sort((a, b) => alphabeticalSort(a.name, b.name)).map(wall => {
                            return (
                                <li className="filter-option">
                                    <span onClick={() => onAddFilter('start', wall.name)}>
                                        <span>{wall.name}</span>
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        },
        {
            id: "end",
            label: "End",
            render: () => {
                return (
                    <ul className="filter-values">
                        {Context.storage.walls.all().sort((a, b) => alphabeticalSort(a.name, b.name)).map(wall => {
                            return (
                                <li className="filter-option">
                                    <span onClick={() => onAddFilter('end', wall.name)}>
                                        <span>{wall.name}</span>
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        },
        {
            id: "grade",
            label: "Grade",
            render: () => {
                return (
                    <ul className="filter-values">
                        {Context.storage.grades.all().sort((a, b) => alphabeticalSort(a.name, b.name)).map(grade => {
                            return (
                                <li className="filter-option">
                                    <span onClick={() => onAddFilter('grade', grade.name)}>
                                        <Grade name={grade.name} color={grade.color}/>
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        },
        {
            id: "tag",
            label: "Tag",
            render: () => {
                return (
                    <ul className="filter-values">
                        {Context.storage.tags.all().sort((a, b) => alphabeticalSort(a.name, b.name)).map(tag => {
                            return (
                                <li className="filter-option">
                                    <span onClick={() => alert('add filter')}>
                                        <Emoji>{tag.emoji}</Emoji> {tag.name}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        },
        {
            id: "ascent",
            label: "Ascent",
            render: () => {
                return (
                    <ul className="filter-values">
                        {Context.core.ascents.sort((a, b) => alphabeticalSort(a.name, b.name)).map(ascent => {
                            return (
                                <li className="filter-option">
                                    <span onClick={() => alert('add filter')}>
                                        <Icon name={ascent.id}/> {ascent.name}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>
                )
            }
        }
    ];

    return (
        <div className={classnames("filter-dropdown", dropped ? "filter-dropdown--dropped" : null)}>
            <div className="filter-tabs">
                <ul className="tab-nav">
                    {tabs.map(tab => {
                        return (
                            <li className="tab-nav-item">
                                <HyperLink active={isActive(tab.id)} onClick={() => setActiveTab(tab.id)}>
                                    {tab.label}
                                </HyperLink>
                            </li>
                        )
                    })}
                </ul>

                <div className="tab-content">
                    {tabs.find(tab => tab.id === activeTab).render()}
                </div>
            </div>
        </div>
    )
};
