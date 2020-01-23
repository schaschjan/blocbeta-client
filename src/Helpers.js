import {useTable, useFilters, useSortBy, useRowSelect} from "react-table";
import React from "react";
import Context from "./Context";

export function getPath(path) {
    return `/${Context.getLocationUrl()}${path}`;
}

export function isAdmin() {
    return window.location.pathname.includes('/admin')
}

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

export function getColorOption(id) {
    const color = resolveColor(id);

    return {
        label: color.name,
        value: color.id
    };
}

export function getTagOption(id) {
    const tag = resolveTag(id);

    return {
        label: `${tag.emoji} – ${tag.name}`,
        value: tag.id
    };
}

export function getWallOption(id) {
    const wall = resolveWall(id);

    return {
        label: wall.name,
        value: wall.id
    };
}

export function getSetterOption(id) {
    const setter = resolveSetter(id);

    return {
        label: setter.username,
        value: setter.id
    };
}

export function getStatusOption(status) {
    return {
        label: status,
        value: status
    }
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

export function getGradeOption(id) {
    const grade = resolveGrade(id);

    return {
        value: grade.id,
        label: grade.name
    }
}

export function getBoulder(id) {
    return fetch(`/boulder/${id}`)
        .then(response => response.json())
}

export function getBoulders(location) {

    return fetch(`/${location}/boulder/filter/active`)
        .then(response => response.json())
        .then(boulders => {
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

            return boulders;
        });
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