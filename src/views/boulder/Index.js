import React, {useState, useEffect} from 'react';
import {Loader} from "../../components/Loader";
import db from "../../db";
import Context from "../../Context";
import {resolveBoulder} from "../../Helpers";
import ApiClient from "../../ApiClient";
import Grade from "../../components/Grade/Grade";
import moment from "moment";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import Paragraph from "../../components/Paragraph/Paragraph";
import Icon from "../../components/Icon/Icon";
import Table from "../../components/Table/Table";
import Ascent from "../../components/Ascent/Ascent";

const AdminTable = ({data}) => {

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
                Header: 'Points',
                accessor: 'points',
                Cell: ({cell}) => (
                    <Paragraph>{cell.value} pts</Paragraph>
                )
            },
            {
                Header: 'Name',
                id: 'expander',
                accessor: 'name',
                grow: true,
                Cell: ({row, cell}) => (
                    <Paragraph>
                        <span {...row.getExpandedToggleProps()}>
                            {cell.value}
                            {row.isExpanded ? <Icon name="forward"/> : <Icon name="forward"/>}
                        </span>
                    </Paragraph>
                ),
            },
            {
                Header: 'Start',
                accessor: 'startWall.name',
                Cell: ({cell}) => (
                    <Paragraph>{cell.value}</Paragraph>
                )
            },
            {
                Header: 'End',
                accessor: 'endWall.name',
                Cell: ({cell}) => (
                    <Paragraph>{cell.value}</Paragraph>
                )
            },
            {
                Header: 'Date',
                accessor: 'createdAt',
                Cell: ({cell}) => {
                    return (
                        <Paragraph>{moment(cell.value).fromNow()}</Paragraph>
                    )
                }
            },
            {
                Header: 'Ascent',
                accessor: 'me',
                Cell: ({cell}) => {
                    const ascent = cell.value;

                    let flashed, topped, resigned = false;

                    if (ascent && ascent.type === 'flash') {
                        flashed = true
                    }

                    if (ascent && ascent.type === 'top') {
                        topped = true
                    }

                    if (ascent && ascent.type === 'resign') {
                        resigned = true
                    }

                    return (
                        <React.Fragment>
                            <Ascent type="flash" checked={flashed} handler={() => alert('flash')}/>
                            <Ascent type="top" checked={topped} handler={() => alert('top')}/>
                            <Ascent type="resign" checked={resigned} handler={() => alert('resign')}/>
                        </React.Fragment>
                    )
                }
            }], []);

    return <Table columns={columns} data={data} renderRowSubComponent={renderRowSubComponent}/>

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

                await resolveBoulder(boulder);

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