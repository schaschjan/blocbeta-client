import React, {useState, useEffect} from 'react';
import moment from "moment";
import {useFilters, useRowSelect, useSortBy, useTable} from "react-table";
import {Link} from "react-router-dom";
import Button from "../../components/Button";
import {SelectFilter} from "../../Helpers";
import HoldStyle from "../../components/HoldStyle";
import Grade from "../../components/Grade";
import {Loader} from "../../components/Loader";
import ApiClient from "../../ApiClient";
import db from "../../db";

const IndeterminateCheckbox = React.forwardRef(
    ({indeterminate, ...rest}, ref) => {
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate]);

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        )
    }
);

function Table({data}) {

    const columns = React.useMemo(() => [
        {
            id: 'edit',
            Header: () => {
                return (
                    <div>
                        <select>
                            <option>Select…</option>
                            <option>Activate</option>
                            <option>Deactivate</option>
                            <option>Prune ascents</option>
                        </select>
                    </div>
                )
            },
            accessor: null,
            Cell: ({row}) => {
                return <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            }
        },
        {
            Header: 'Name',
            accessor: 'name',
            Filter: null,
            Cell: ({cell, row}) => {
                return (
                    <Link to={`/${window.location.slug}/admin/boulder/edit/${row.original.id}`}>
                        {cell.value}
                    </Link>
                )
            }
        },
        {
            Header: 'Color',
            accessor: 'color',
            Filter: SelectFilter,
            filter: 'equals',
            Cell: ({cell}) => {
                return <HoldStyle name={cell.value}/>
            }
        },
        {
            Header: 'Grade',
            accessor: 'grade.id',
            Filter: SelectFilter,
            Cell: ({cell}) => {
                return <Grade id={cell.value}/>
            }
        },
        {
            Header: 'Start',
            accessor: 'startWall.name',
            Filter: SelectFilter
        },
        {
            Header: 'End',
            accessor: 'endWall.name',
            Filter: SelectFilter
        },
        {
            Header: 'Setters',
            accessor: 'setters',
            Filter: null,
            Cell: ({row}) => {
                return row.original.setters.map(setter => {
                    return setter.username + ' ';
                });
            }
        },
        {
            Header: 'Tags',
            accessor: 'tags',
            Filter: null,
            Cell: ({row}) => {
                return row.original.tags.map(tag => {
                    return tag.emoji + ' ';
                });
            }
        },
        {
            Header: 'Set',
            accessor: 'createdAt',
            Filter: null,
            Cell: row => (
                <span>{moment().fromNow()}</span>
            )
        },
    ]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
    } = useTable(
        {
            columns,
            data,
        },
        useFilters,
        useSortBy,
        useRowSelect,
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

            <code>
                {JSON.stringify(
                    {
                        'selected': selectedFlatRows.map(
                            d => d.original.id
                        ),
                    },
                    null,
                    2
                )}
            </code>
        </div>
    )
}

export default function Index() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function getData() {
            const boulders = await db.boulders.toArray();

            for (let boulder of boulders) {
                boulder.startWall = await db.walls.get(boulder.startWall.id);

                if (boulder.endWall) {
                    boulder.endWall = await db.walls.get(boulder.endWall.id);
                }

                boulder.grade = await db.grades.get(boulder.grade.id);
                boulder.color = await db.holdStyles.get(boulder.color.id);

                for (let [key, tag] of Object.entries(boulder.tags)) {
                    boulder.tags[key] = await db.tags.get(tag.id);
                }

                for (let [key, setter] of Object.entries(boulder.setters)) {
                    boulder.setters[key] = await db.setters.get(setter.id);
                }
            }
        }

        getData();

        ApiClient.getAscents().then(response => {

        });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Boulder ({data.length})</h1>

            <div className="d-flex f-column">
                <Table data={data}/>
                <Link to={`/${window.location.slug}/admin/boulder/add`}>
                    <Button>Add</Button>
                </Link>`
            </div>
        </div>
    )
};