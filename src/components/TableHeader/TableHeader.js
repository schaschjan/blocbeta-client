import React from 'react';
import './TableHeader.css';

const TableHeader = ({children}) => {

    return (
        <div className="table-header">
            {children}
        </div>
    )
};

export default TableHeader