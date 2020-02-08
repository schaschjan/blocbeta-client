import React, {useState, useEffect} from 'react';
import {Loader} from "../../../components/Loader/Loader";
import db from "../../../db";
import {resolveBoulder} from "../../../Helpers";
import ApiClient from "../../../ApiClient";
import Grade from "../../../components/Grade/Grade";
import moment from "moment";
import HoldStyle from "../../../components/HoldStyle/HoldStyle";
import Paragraph from "../../../components/Paragraph/Paragraph";
import Icon from "../../../components/Icon/Icon";
import Table from "../../../components/Table/Table";
import Ascent from "../../../components/Ascent/Ascent";
import "./Index.css";

const Index = () => {
    const [boulders, setBoulders] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
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
                <React.Fragment>
                    <Paragraph>
                        {cell.value}
                    </Paragraph>

                    <span {...row.getExpandedToggleProps()}>
                        {row.isExpanded ? <Icon name="downward"/> : <Icon name="forward"/>}
                      </span>
                </React.Fragment>
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
        }
    ];

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
            setBoulders(data);
            setLoading(false);
        });
    }, []);

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

        boulders[0].name = 'pooop';
        console.log(boulders);

        setBoulders(boulders);

        // if (!ascentId) {
        //     ApiClient.createAscent({
        //         'boulder': boulderId,
        //         'type': type
        //     }).then(data => {
        //         alert(data);
        //     });
        //
        // } else {
        //     boulders.filter(boulder => {
        //         if (!boulder.me) {
        //             return null
        //         }
        //
        //         boulder.me = null;
        //     });
        //     console.log(boulders);
        //     setBoulders(boulders);
        //     console.log(boulders);
        //
        //     // ApiClient.deleteAscent(ascentId).then(() => {
        //     //
        //     // });
        // }
    };

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Boulder ({boulders.length})</h1>

            <Table columns={columns}
                   data={boulders}
                   renderRowSubComponent={renderRowSubComponent}/>
        </div>
    )
};

export default Index