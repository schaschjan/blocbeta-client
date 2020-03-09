import React from 'react';
import './Table.css';
import {useExpanded, usePagination, useTable, useFilters, useGlobalFilter, useSortBy} from "react-table";
import Paragraph from "../Paragraph/Paragraph";
import Icon from "../Icon/Icon";
import classnames from "classnames";

const TableRow = ({children}) => {
    return (
        <div className="table-row">
            {children}
        </div>
    )
};

const TableCell = ({children, className}) => {
    return (
        <div className={classnames('table-cell', className)}>
            {children}
        </div>
    )
};

const TableHeader = ({children}) => {
    return (
        <div className="table-header">
            {children}
        </div>
    )
};

const TableHeaderCell = ({children, ...rest}) => {
    return (
        <div className="table-header-cell" {...rest}>
            {children}
        </div>
    )
};

const TableFooter = ({pageIndex, pageSize, pageOptions, canPreviousPage, canNextPage, previousPage, nextPage}) => {
    return (
        <div className="table-footer">
            <div className="pager">
                <Paragraph className="pager-info">
                    {pageIndex * pageSize} - {(pageIndex + 1) * pageSize} of {pageOptions.length * pageSize}
                </Paragraph>

                <span onClick={() => previousPage()}
                      className={classnames('toggle-previous', !canPreviousPage ? 'toggle-previous--disabled' : null)}>

                <Icon name="back"/>
            </span>

                <span onClick={() => nextPage()}
                      className={classnames('toggle-next', !canNextPage ? 'toggle-next--disabled' : null)}>

                 <Icon name="forward"/>
            </span>
            </div>
        </div>
    )
};

function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter}}) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

const GlobalFilter = ({preGlobalFilteredRows, globalFilter, setGlobalFilter}) => {
    const count = preGlobalFilteredRows.length;

    return (
        <input
            value={globalFilter || ""}
            onChange={e => {
                setGlobalFilter(e.target.value || undefined);
            }}
            placeholder={`Filter ${count} records...`}
        />
    )
};

const Table = ({columns, data, renderRowSubComponent, className, pager = true, pageSize = 20}) => {

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const filterTypes = React.useMemo(
        () => ({
            text: (rows, id, filterValue) => {
                console.log(rows, id, filterValue);

                return rows.filter(row => {
                    const rowValue = row.values[id];

                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        preGlobalFilteredRows,
        setGlobalFilter,

        state: {
            pageIndex,
            globalFilter
        },

    } = useTable({
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: {pageIndex: 0, pageSize: pager ? pageSize : data.length},
            autoResetFilters: false,
            autoResetSortBy: false,
            autoResetPage: false
        },

        useFilters,
        useGlobalFilter,
        useExpanded,
        useSortBy,
        usePagination,
    );

    return <React.Fragment>
        <div className="filter">
            <Icon name="search"/>

            <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />

            <Icon name="filtermenu"/>
        </div>

        <div className={classnames("table", className)} {...getTableProps()}>
            <TableHeader>
                {headerGroups.map(headerGroup => (
                    <React.Fragment>
                        {headerGroup.headers.map(column => (
                            <TableHeaderCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span className="sort-indicator">
                    {column.isSorted ? column.isSortedDesc ? <Icon name="down"/> : <Icon name="up"/>
                        : ''}
                  </span>
                            </TableHeaderCell>
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
                                    return <TableCell {...cell.getCellProps({className: cell.column.className})}>{cell.render('Cell')}</TableCell>
                                })}
                            </TableRow>
                            {row.isExpanded ? (
                                <div>
                                    <div>
                                        {renderRowSubComponent({row})}
                                    </div>
                                </div>
                            ) : null}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>

        {pager && (
            <TableFooter
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageOptions={pageOptions}

                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}

                previousPage={previousPage}
                nextPage={nextPage}
            />)
        }
    </React.Fragment>
};

export default Table