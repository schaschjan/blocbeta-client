import React from 'react';
import './TableRow.css';

const TableRow = ({children}) => {
    return (
        <div className="table-row">
            {children}
        </div>
    )
};

export default TableRow