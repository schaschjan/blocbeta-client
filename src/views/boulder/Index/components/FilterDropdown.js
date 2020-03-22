import React, {Fragment} from 'react';
import "./FilterDropdown.css";
import Context from "../../../../Context";
import Container from "../../../../components/Container/Container";
import HoldStyle from "../../../../components/HoldStyle/HoldStyle";
import {alphabeticalSort} from "../../../../Helpers";

export const FilterDropdown = () => {

    return (
        <div className="filter-dropdown">
            <Container>
                <div className="filter-tabs">
                    <ul className="tab-nav">
                        <li className="tab-nav-item tab-nav-item--active">Grade</li>
                        <li>Start</li>
                        <li>End</li>
                        <li>Tags</li>
                    </ul>

                    <ul className="tab-content">
                        <li className="tab-page">
                            <ul className="filter-values">
                                {Context.storage.holdStyles.all().sort((a, b) => alphabeticalSort(a.name, b.name)).map(holdStyle => {
                                    return (
                                        <li className="filter-option">
                                            <span onClick={() => alert('add filter')}>
                                                <HoldStyle name={holdStyle.name} small={true}/>
                                                <span>{holdStyle.name}</span>
                                            </span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    </ul>
                </div>
            </Container>
        </div>
    )
};
