import {useTable, useExpanded} from "react-table";
import React from "react";

export function getOptions(resource) {
    return Object.values(resource).map(element => {
        return {
            value: element.id,
            label: element.name
        }
    });
}

export function Table({columns, data, renderRowSubComponent}) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        flatColumns,
    } = useTable({
            columns,
            data,
        },
        useExpanded
    );

    // Render the UI for your table
    return (
        <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)

                return (
                    // Use a React.Fragment here so the table markup is still valid
                    <React.Fragment>
                        <tr>
                            {row.cells.map(cell => {
                                return (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                )
                            })}
                        </tr>
                        {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                        {row.isExpanded ? (
                            <tr>
                                <td colSpan={flatColumns.length}>
                                    {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                                    {renderRowSubComponent({row})}
                                </td>
                            </tr>
                        ) : null}
                    </React.Fragment>
                )
            })}
            </tbody>
        </table>
    )
}