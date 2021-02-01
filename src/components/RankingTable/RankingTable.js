import {useGlobalFilter, useSortBy, useTable} from "react-table";
import React from "react";
import {TableCell, TableHeader, TableRow} from "../Table/Table";
import SwipeOut from "../SwipeOut/SwipeOut";
import {Input} from "../Input/Input";
import {classNames} from "../../helper/classNames";
import {useMediaQuery} from 'react-responsive'
import "./RankingTable.css";

const Row = ({cells, ...rest}) => {
    const isTabletOrMobile = useMediaQuery({maxWidth: 1224})

    if(isTabletOrMobile)
    {
        return  "poop"
    }

    return (
        <TableRow {...rest}>
            {cells.map((cell) => {
                return (
                    <TableCell
                        {...cell.getCellProps({
                            className: cell.column.className,
                        })}
                    >
                        {cell.render("Cell")}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

const RankingTable = ({columns, data, Actions, className}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setGlobalFilter,
    } = useTable(
        {
            columns,
            data,
        },
        useGlobalFilter,
        useSortBy
    );

    return (
        <div className="ranking-table-layout">
            <Input
                className="ranking-table-layout__search"
                placeholder="Search for member"
                onClear={() => setGlobalFilter(null)}
                clearable={true}
                onChange={(event) => {
                    setGlobalFilter(event.target.value);
                }}
            />

            <div
                className={classNames(
                    "table",
                    `table--${className}`
                )}
                {...getTableProps()}
            >
                <TableHeader headerGroups={headerGroups}/>

                <div className="table-content" {...getTableBodyProps()}>
                    {rows.map((row, index) => {
                        prepareRow(row);

                        if (Actions) {
                            return (
                                <SwipeOut actions={Actions} key={row.index}>
                                    <Row key={index} cells={row.cells}/>
                                </SwipeOut>
                            );
                        }

                        return <Row cells={row.cells} key={row.index}/>;
                    })}
                </div>
            </div>
        </div>
    );
};

export default RankingTable;
