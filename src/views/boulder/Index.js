import React, {useState, useEffect} from 'react';
import {Loader} from "../../components/Loader";
import db from "../../db";
import Context from "../../Context";
import {Table} from "../../Helpers";
import ApiClient from "../../ApiClient";
import Grade from "../../components/Grade";
import HoldStyle from "../../components/HoldStyle";
import Icon from "../../components/Icon";
import moment from "moment";

const AdminTable = (data) => {

    const renderRowSubComponent = React.useCallback(
        ({row}) => (
            <pre
                style={{
                    fontSize: '10px',
                }}
            >
        <code>{JSON.stringify({values: row.values}, null, 2)}</code>
      </pre>
        ),
        []
    );

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                id: 'expander',
                accessor: 'name',
                Cell: ({row}) => (
                    // Use Cell to render an expander for each row.
                    // We can use the getExpandedToggleProps prop-getter
                    // to build the expander.
                    <span {...row.getExpandedToggleProps()}>
            {row.isExpanded ? '👇' : '👉'}
          </span>
                ),
            },
            {
                Header: 'Color',
                accessor: 'color.name',
                Cell: ({cell}) => {
                    return <HoldStyle name={cell.value}/>
                }
            },
            {
                Header: 'Grade',
                accessor: 'grade',
                Cell: ({cell}) => {
                    return <Grade name={cell.value.name} color={cell.value.color}/>
                }
            },
            {
                Header: 'Ascents',
                accessor: 'ascents',
            },
            {
                Header: 'Start',
                accessor: 'startWall.name',
            },
            {
                Header: 'End',
                accessor: 'endWall.name',
            },
            {
                Header: 'Setters',
                accessor: (row) => {
                    return row.setters.map(setter => setter.username)
                }
            },
            {
                Header: 'Tags',
                accessor: (row) => {
                    return row.tags.map(tag => tag.emoji)
                }
            },
            {
                Header: 'Date',
                accessor: 'createdAt',
                Cell: ({cell}) => {
                    return (
                        <span>{moment(cell.value).fromNow()}</span>
                    )
                }
            },
            {
                Header: 'Me',
                accessor: 'me.type',
                Cell: ({cell}) => {
                    return <Icon name={cell.value}/>
                }
            }], []);

    return <Table columns={columns} data={data.data} renderRowSubComponent={renderRowSubComponent}/>

};

export default function Index() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            const ascents = await ApiClient.getAscents().then(ascents => {
                return ascents.reduce((obj, item) => Object.assign(obj, {[item.boulderId]: item}), {});
            });

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

                const ascentData = ascents[boulder.id];

                if (!ascentData) {
                    console.error(boulder.id + ' not found');
                    continue
                }

                boulder.points = ascentData.points;
                boulder.ascents = ascentData.ascents;
                boulder.me = ascentData.me;
            }

            return boulders;
        }

        getData().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader/>;

    const Table = () => {

        if (Context.isAdmin()) {
            return <AdminTable data={data}/>
        } else {
            return <div>User Table</div>
        }
    };

    return (
        <div className="container">
            <h1>Boulder ({data.length})</h1>

            <Table/>
        </div>
    )
};