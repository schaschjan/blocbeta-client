import {useTable, useFilters, useSortBy, useRowSelect} from "react-table";
import React from "react";

export function resolveGrade(id) {
    return window.grades[id]
}

export function resolveColor(id) {
    return window.colors[id]
}

export function resolveWall(id) {
    return window.walls[id]
}

export function resolveTag(id) {
    return window.tags[id]
}

export function resolveSetter(id) {
    return window.setters[id]
}

export function resolveBoulders() {
    return Object.values(window.boulders);
}

export function getOptions(resource) {
    return Object.values(resource).map(element => {
        return {
            value: element.id,
            label: element.name
        }
    });
}

export function getGradeOptions() {
    return Object.values(window.grades).map(grade => {
        return {
            value: grade.id,
            label: grade.name
        }
    });
}

export function getBoulders() {

    const boulders = Object.values(window.boulders);

    for (let boulder of boulders) {
        const color = resolveColor(boulder.color.id);
        const startWall = resolveWall(boulder.startWall.id);

        if (!boulder.endWall) {
            boulder.endWall = null;
        } else {
            boulder.endWall = resolveWall(boulder.endWall.id);
        }

        const tags = [];

        for (let tag of boulder.tags) {
            tags.push(resolveTag(tag.id))
        }

        const setters = [];

        for (let setter of boulder.setters) {
            setters.push(resolveSetter(setter.id))
        }

        boulder.color = color.name;
        boulder.startWall = startWall;
        boulder.tags = tags;
        boulder.setters = setters;

        for (let tag of boulder.tags) {
            resolveTag(tag.id);
        }
    }

    return boulders
}

export function EditableCell({cell: {value: initialValue}, row: {index}, column: {id}, updateMyData}) {

    const [value, setValue] = React.useState(initialValue);

    const onChange = e => {
        setValue(e.target.value)
    };

    console.log(initialValue);

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value)
    };

    // If the initialValue is changed externall, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue]);

    return <input value={value} onChange={onChange} onBlur={onBlur}/>
}

export function Table({columns, data}) {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters,
        useSortBy,
        useRowSelect
    );

    const columnCount = columns.length;

    return (
        <div {...getTableProps()}>
            {headerGroups.map(headerGroup => (
                <div {...headerGroup.getHeaderGroupProps()}
                     className={"collection-filter collection-filter--" + columnCount}>
                    {headerGroup.headers.map(column => (
                        <div {...column.getHeaderProps(column.getSortByToggleProps())}
                             className="collection-filter__item">

                            <div>
                                {column.canFilter ? column.render('Filter') : null}
                                <span>{column.isSorted ? column.isSortedDesc ? ' 🔽' : ' 🔼' : ''}</span>
                            </div>

                            {column.render('Header')}
                        </div>
                    ))}
                </div>
            ))}

            <ol {...getTableBodyProps()} className={"row"}>
                {rows.map(
                    (row) => {
                        prepareRow(row);

                        return (
                            <li {...row.getRowProps()} className={"collection collection--" + columnCount}>
                                {row.cells.map(cell => {
                                    return (
                                        <div {...cell.getCellProps()} className="collection__item">
                                            {cell.render('Cell')}
                                        </div>
                                    )
                                })}
                            </li>
                        )
                    }
                )}
            </ol>
        </div>
    )
}

export function SelectFilter({column: {filterValue, setFilter, preFilteredRows, id},}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set();

        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        });

        return [...options.values()].sort()

    }, [id, preFilteredRows]);

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}