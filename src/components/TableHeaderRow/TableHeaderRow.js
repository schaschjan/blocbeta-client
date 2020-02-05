import React from 'react';
import './TableHeaderRow.css';

const TableHeaderRow = ({children}) => {

    return (
        <div className="table-header-row">
            {children}
        </div>
    )
};

export default TableHeaderRow