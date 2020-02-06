import React, {useState, useEffect} from 'react';
import {Loader} from "../../components/Loader";
import db from "../../db";
import {resolveBoulder} from "../../Helpers";
import ApiClient from "../../ApiClient";
import Grade from "../../components/Grade/Grade";
import moment from "moment";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import Paragraph from "../../components/Paragraph/Paragraph";
import Icon from "../../components/Icon/Icon";
import Table from "../../components/Table/Table";
import Ascent from "../../components/Ascent/Ascent";

export default function Index() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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
                Cell: ({row, cell}) => {
                    const ascent = cell.value;

                    let flashed = false;
                    let topped = false;
                    let resigned = false;

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
                            <Ascent type="flash"
                                    disabled={!flashed && ascent}
                                    checked={flashed}
                                    handler={() => ascentHandler(row.original.id, "flash", ascent ? ascent.id : null)}/>

                            <Ascent type="top"
                                    disabled={!topped && ascent}
                                    checked={topped}
                                    handler={() => ascentHandler(row.original.id, "top", ascent ? ascent.id : null)}/>

                            <Ascent type="resign"
                                    disabled={!resigned && ascent}
                                    checked={resigned}
                                    handler={() => ascentHandler(row.original.id, "resign", ascent ? ascent.id : null)}/>
                        </React.Fragment>
                    )
                }
            }], []);

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

    const ascentHandler = (boulderId, type, ascentId = null) => {
        if (!ascentId) {
            ApiClient.createAscent({
                'boulder': boulderId,
                'type': type
            }).then(data => {
                alert(data);
            });

        } else {
            // ApiClient.deleteAscent()
            alert('remove ' + ascentId + ' for ' + boulderId);
        }
    };

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

    return (
        <div className="container">
            <h1>Boulder ({data.length})</h1>

            <Table columns={columns} data={data} renderRowSubComponent={renderRowSubComponent}/>
        </div>
    )
};