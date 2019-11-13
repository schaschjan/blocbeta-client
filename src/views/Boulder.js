import React from 'react';
import {getBoulders, Table, EditableCell} from "../Helpers";

function SelectFilter({column: {filterValue, setFilter, preFilteredRows, id},}) {
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

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
        Filter: null
    },
    {
        Header: 'Color',
        accessor: 'color',
        Filter: SelectFilter,
        filter: 'equals',
    },
    {
        Header: 'Grade',
        accessor: 'grade',
        Filter: SelectFilter,
        Cell: EditableCell
    },
    {
        Header: 'Score',
        accessor: 'score',
        Filter: null,
        Cell: ({row}) => {

            if (row.original.score) {
                return <span>+{row.original.score.points} ({row.original.score.ascents})</span>;
            }
            return 'pooop';
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