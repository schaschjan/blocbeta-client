import React from 'react';
import {Table, SelectFilter} from "../../Helpers";

const columns = [
    {
        id: 'selection',
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({getToggleAllRowsSelectedProps}) => (
            <div>
                <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
            </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({row}) => (
            <div>
                <input type="checkbox" {...row.getToggleRowSelectedProps()} />
            </div>
        ),
    },
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
        Header: 'Start',
        accessor: 'startWall.name',
        Filter: SelectFilter
    },
    {
        Header: 'End',
        accessor: 'endWall.name',
        Filter: SelectFilter
    }
];

export class Active extends React.Component {

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

export class Add extends React.Component {

    render() {
        return (
            <div>poop</div>
        )
    }
}