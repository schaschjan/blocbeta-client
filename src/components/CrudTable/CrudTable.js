import React, {Fragment, useEffect, useState} from "react";
import {useTable, useGroupBy, useExpanded} from "react-table"
import "./CrudTable.css";
import Downward from "../Icon/Downward";
import Forward from "../Icon/Forward";
import Input from "../../components/Input/Input";

export const EditableCell = ({
                               value: initialValue,
                               row: {index},
                               column: {id},
                               updateHandler,
                             }) => {

  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value)
  };

  const onBlur = () => {
    updateHandler(index, id, value)
  };

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue]);

  return <Input value={value}
                onChange={onChange}
                onBlur={onBlur}
                filled={true}
                size={"small"}/>
};

export const CrudTable = ({columns, data, updateHandler, defaultColumn = {canGroupBy: false}, defaultGroupBy = []}) => {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      initialState: {
        groupBy: defaultGroupBy
      },
      autoResetExpanded: false,
      columns,
      data,
      defaultColumn,
      updateHandler
    },
    useGroupBy,
    useExpanded
  );

  return (
    <table {...getTableProps()} className="crud-table">
      <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>
              {column.canGroupBy === true ? (

                <span {...column.getGroupByToggleProps()}>
                      {column.isGrouped ? <Downward/> : <Forward/>}
                    </span>
              ) : null}
              {column.render('Header')}
            </th>
          ))}
        </tr>
      ))}
      </thead>

      <tbody {...getTableBodyProps()}>
      {rows.map((row, i) => {
        prepareRow(row);
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <td {...cell.getCellProps()}>
                {cell.isGrouped ? (
                  <Fragment>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? <Downward/> : <Forward/>}
                          </span>{' '}
                    {cell.render('Cell')} ({row.subRows.length})
                  </Fragment>
                ) : cell.isAggregated ? (cell.render('Aggregated')
                ) : cell.isPlaceholder ? null : (cell.render('Cell')

                )}
              </td>
            })}
          </tr>
        )
      })}
      </tbody>
    </table>
  )
};