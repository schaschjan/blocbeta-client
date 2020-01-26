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
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

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
            {rows.map(
                (row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            })}
                        </tr>
                    )
                }
            )}
            </tbody>
        </table>
    )
}