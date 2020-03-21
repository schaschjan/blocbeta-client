import React, {Fragment} from 'react';
import "./FilterDropdown.css";
import Context from "../../../../Context";
import Container from "../../../../components/Container/Container";
import HoldStyle from "../../../../components/HoldStyle/HoldStyle";

export const FilterDropdown = () => {

    return (
        <div className="filter-dropdown">
            <Container>
                <ul className="filter-tabs">
                    <li className="filter-tab filter-tab--active">
                        <span className="tab-title">Color</span>

                       <div className="tab-content">
                           <ul className="filter-values">
                               {Context.storage.holdStyles.all().map(holdStyle => {
                                   return (
                                       <li>
                                           {/*<HoldStyle name={holdStyle.name} small={true}/>*/}
                                           <label>{holdStyle.name}</label>
                                       </li>

                                   )
                               })}
                           </ul>
                       </div>
                    </li>

                    <li className="filter-tab">
                        <span className="tab-title">Grade</span>
                    </li>

                    <li className="filter-tab">
                        <span className="tab-title">Start</span>
                    </li>

                    <li className="filter-tab">
                        <span className="tab-title">End</span>
                    </li>

                    <li className="filter-tab">
                        <span className="tab-title">Tags</span>
                    </li>
                </ul>
            </Container>
        </div>
    )
};
