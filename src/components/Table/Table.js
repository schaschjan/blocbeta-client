import React from 'react';
import './Table.css';
import {useExpanded, usePagination, useTable} from "react-table";
import TableRow from "../TableRow/TableRow";
import TableCell from "../TableCell/TableCell";
import TableHeader from "../TableHeader/TableHeader";
import TableHeaderRow from "../TableHeaderRow/TableHeaderRow";
import Paragraph from "../Paragraph/Paragraph";
import Icon from "../Icon/Icon";

const Table = ({columns, data, renderRowSubComponent}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        flatColumns,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: {pageIndex, pageSize},
    } = useTable({
            columns,
            data,
            initialState: {pageIndex: 0},
        },
        useExpanded,
        usePagination
    );

    return (
        <React.Fragment>
            <div className="table" {...getTableProps()}>

                <TableHeader>
                    {headerGroups.map(headerGroup => (
                        <React.Fragment>
                            {headerGroup.headers.map(column => (
                                <TableHeaderRow {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </TableHeaderRow>
                            ))}
                        </React.Fragment>
                    ))}
                </TableHeader>

                <div className="table-content" {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);

                        return (
                            <React.Fragment>
                                <TableRow>
                                    {row.cells.map(cell => {
                                        return <TableCell {...cell.getCellProps({grow: cell.column.grow})}>{cell.render('Cell')}</TableCell>
                                    })}
                                </TableRow>
                                {row.isExpanded ? (
                                    <div>
                                        <div colSpan={flatColumns.length}>
                                            {renderRowSubComponent({row})}
                                        </div>
                                    </div>
                                ) : null}
                            </React.Fragment>
                        )
                    })}
                </div>
            </div>

            <div className="pagination">
                <Paragraph>
                    {pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of {pageOptions.length * pageSize}
                </Paragraph>

                <Icon name="back"/>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                {' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>

                <Icon name="forward"/>
            </div>
        </React.Fragment>
    )
}

export default Table