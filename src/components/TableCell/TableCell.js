import React from 'react';
import './TableCell.css';
import classnames from 'classnames';

const TableCell = ({children, grow}) => {

    return (
        <div className={classnames('table-cell', grow ? 'table-cell--grow' : null)}>
            {children}
        </div>
    )
};

export default TableCell