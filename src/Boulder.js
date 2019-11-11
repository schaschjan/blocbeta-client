import React from 'react';
import {useTable} from 'react-table'
import {getBoulders} from "./Helpers";

function Table({columns, data}) {

    const {
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <div>
            <div className="table">
                {headerGroups.map(headerGroup => (
                    <ul {...headerGroup.getHeaderGroupProps()} className="table-row">
                        {headerGroup.headers.map(column => (
                            <li {...column.getHeaderProps()} className="table-column">
                                {column.render('Header')}
                            </li>
                        ))}
                    </ul>
                ))}
            </div>

            <div {...getTableBodyProps()} className="table">
                {rows.map(
                    (row) => {
                        prepareRow(row);

                        return (
                            <ul {...row.getRowProps()} className="table-row">
                                {row.cells.map(cell => {
                                    return <li {...cell.getCellProps()} className="table-column">
                                        {cell.render('Cell')}
                                    </li>
                                })}
                            </ul>
                        )
                    }
                )}
            </div>
        </div>
    )
}

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Color',
        accessor: 'color',
    },
    {
        Header: 'Grade',
        accessor: 'grade'
    },
    {
        Header: 'Score',
        accessor: 'score',
        Cell: ({row}) => {

            if (row.original.score) {
                return <span>+{row.original.score.points} ({row.original.score.ascents})</span>;
            }
            return 'pooop';
        }
    },
    {
        Header: 'Start',
        accessor: 'startWall.name'
    },
    {
        Header: 'End',
        accessor: 'endWall.name'
    },
    {
        Header: 'Setters',
        accessor: 'setters',
        Cell: ({row}) => {
            return row.original.setters.map(setter => {
                return setter.username + ' ';
            });
        }
    },
    {
        Header: 'Tags',
        accessor: 'tags',
        Cell: ({row}) => {
            return row.original.tags.map(tag => {
                return tag.emoji + ' ';
            });
        }
    }
];

class Boulder extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: getBoulders()
        };
    }

    componentDidMount() {

        Promise.all([
            fetch('/ascent/active-boulders').then((response) => response.json()).then(response => {
                for (const score of response) {
                    const result = this.state.data.find((boulder) => {
                        return boulder.id === score.boulderId
                    });

                    if (result) {
                        result.score = score
                    } else {
                        console.log(`Boulder ${score.boulderId} not found`);
                    }
                }
            })

        ]).then(() => {
            this.setState({loading: false})
        });

    }

    render() {
        const {data, loading} = this.state;

        if (loading) {
            return (<div>loading ascents</div>)
        }

        return (
            <Table columns={columns} data={data}/>
        )
    }
}

export default Boulder;