import React, {Fragment, useEffect, useState} from "react";
import {useTable, useGroupBy, useExpanded} from "react-table"
import "./CrudTable.css";
import Downward from "../Icon/Downward";
import Forward from "../Icon/Forward";
import Input from "../../components/Input/Input";
import Switch from "../Switch/Switch";

const useEditableCell = (
  initialValue,
  updateHandler,
  id,
  index,
  updateEvent = "blur",
  eventTargetValue = "value"
) => {
  const [value, setValue] = useState(initialValue);


  const onChange = event => {
    const eventValue = event.target[eventTargetValue];

    setValue(eventValue);

    if (updateEvent === "change") {
      updateHandler(index, id, eventValue)
    }
  };

  const onBlur = (event) => {
    const eventValue = event.target[eventTargetValue];

    if (updateEvent === "blur") {
      updateHandler(index, id, eventValue)
    }
  };

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue]);

  return {onChange, onBlur, value};
};

export const EditableCellSwitch = ({
                                     value: initialValue,
                                     row: {index},
                                     column: {id},
                                     updateHandler,
                                   }) => {

  const {value, onChange, onBlur} = useEditableCell(
    initialValue,
    updateHandler,
    id,
    index,
    "change",
    "checked"
  );

  return <Switch
    id={`${index}-${id}`}
    key={`${index}-${id}`}
    value={value}
    onChange={onChange}
    onBlur={onBlur}/>
};

export const EditableCellInput = ({
                                    value: initialValue,
                                    row: {index},
                                    column: {id},
                                    updateHandler,
                                    inputType,
                                  }) => {

  const {value, onChange, onBlur} = useEditableCell(
    initialValue,
    updateHandler,
    id,
    index
  );

  return <Input value={value}
                type={inputType}
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
      autoResetSortBy: false,
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
