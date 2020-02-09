import React, {useMemo} from 'react';
import './Table.css';
import {useExpanded, usePagination, useTable, useFilters, useGlobalFilter} from "react-table";
import Paragraph from "../Paragraph/Paragraph";
import Icon from "../Icon/Icon";
import classnames from "classnames";
import matchSorter from 'match-sorter'

const TableRow = ({children}) => {
    return (
        <div className="table-row">
            {children}
        </div>
    )
};

const TableCell = ({children, grow}) => {

    return (
        <div className={classnames('table-cell', grow ? 'table-cell--grow' : null)}>
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

const TableHeaderRow = ({children}) => {

    return (
        <div className="table-header-row">
            {children}
        </div>
    )
};

const TableFooter = ({pageIndex, pageSize, pageOptions, canPreviousPage, canNextPage, previousPage, nextPage}) => {

    return (
        <div className="table-footer">
            <div className="pager">
                <Paragraph>
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

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, {keys: [row => row.values[id]]})
}

fuzzyTextFilterFn.autoRemove = val => !val;

function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter}) {
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
}

const Table = ({columns, data, renderRowSubComponent, createChecksum}) => {

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    );

    const filterTypes = React.useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            text: (rows, id, filterValue) => {
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
        state: {pageIndex, pageSize, globalFilter},
    } = useTable({
            columns,
            data,
            defaultColumn,
            filterTypes,
            initialState: {pageIndex: 0},
        },
        useFilters,
        useGlobalFilter,
        useExpanded,
        usePagination,
    );

    const checksum = createChecksum(data);

    return useMemo(() => {
        console.log('render');

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

            <TableFooter
                pageIndex={pageIndex}
                pageSize={pageSize}
                pageOptions={pageOptions}

                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}

                previousPage={previousPage}
                nextPage={nextPage}
            />
        </React.Fragment>
    }, [checksum, globalFilter]);
};

export default Table