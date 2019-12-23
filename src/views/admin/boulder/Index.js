import React, {useState, useEffect} from 'react';
import {getBoulders, SelectFilter} from "../../../Helpers";
import moment from "moment";
import HoldStyle from "../../../components/HoldStyle";
import Grade from "../../../components/Grade";
import {useFilters, useRowSelect, useSortBy, useTable} from "react-table";
import {Link} from "react-router-dom";
import Button from "../../../components/Button";
import {useParams} from "react-router-dom";

const columns = [
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
];

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

function Table({columns, data}) {

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
    const {location} = useParams();

    useEffect(() => {
        getBoulders(location).then(boulders => {
            setData(boulders);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="loader">
                <em>loading</em>
            </div>
        )
    }

    return (
        <div className="container">
            <h1>Boulder </h1>

            <div className="d-flex f-column">
                <Table columns={columns} data={data}/>
                <Button>Add</Button>
            </div>
        </div>
    )
};