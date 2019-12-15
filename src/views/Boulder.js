import React from 'react';
import {getBoulders, Table, SelectFilter} from "../Helpers";
import moment from "moment";

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
    },
    {
        Header: 'Set',
        accessor: 'createdAt',
        Filter: null,
        Cell: row => (
            <span>{moment(row.value).fromNow()}</span>
        )
    },
    {
        Header: 'Ascents',
        accessor: 'ascents',
        Filter: null,
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