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
import Button from "../../../components/Button/Button";
import Drawer from "../../../components/Drawer/Drawer";

const Index = () => {
    const [boulders, setBoulders] = useState(null);
    const [loading, setLoading] = useState(true);

    const [details, setDetails] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

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
            accessor: 'name',
            className: 'table-cell__name',
            Cell: ({cell, row}) => (
                <Button onClick={() => triggerDetail(row.original.id)}>
                    {cell.value} <Icon name="forward"/>
                </Button>
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
                    <Paragraph>{moment(cell.value).format('D MMM')}</Paragraph>
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

            return boulders
        }

        getData().then(data => {
            setBoulders(data);
            setLoading(false);
        });
    }, []);

    const ascentHandler = (boulderId, type, ascentId = null) => {
        const boulder = boulders.find(boulder => boulder.id === boulderId);

        if (!ascentId) {
            ApiClient.createAscent({
                'boulder': boulderId,
                'type': type
            }).then(data => {
                boulder.me = data.me;
                setBoulders([...boulders]);
            });

        } else {
            ApiClient.deleteAscent(ascentId).then(() => {
                boulder.me = null;
                setBoulders([...boulders]);
            });
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const triggerDetail = async (boulderId) => {
        toggleDrawer();
        setDetailsLoading(true);

        const boulder = await ApiClient.getBoulder(boulderId);
        await resolveBoulder(boulder);

        setDetails(boulder);
        setDetailsLoading(false);
    };

    const DrawerHeader = ({data}) => {
        return <React.Fragment>
            <h3>{data.name}</h3>
        </React.Fragment>
    };


    const DrawerContent = ({data}) => {

        return <React.Fragment>
            <div className="detail__list">
                <h4>Tags ({data.tags.length})</h4>

                <ul>
                    {data.tags.map(tag => {
                        return <li>
                            {tag.emoji} {tag.name}
                        </li>
                    })}
                </ul>
            </div>

            <div className="detail__list">
                <h4>Ascents ({data.ascents.length})</h4>
                <ul>
                    {data.ascents.map(ascent => {
                        return <li>
                            <Icon name={ascent.type}/>
                            {ascent.user.username}
                            <Button text={true}>Doubt it</Button>
                        </li>
                    })}
                </ul>
            </div>

            <div className="detail__list">
                <h4>Setters ({data.setters.length})</h4>
                <ul>
                    {data.setters.map(setter => {
                        return <li>
                            {setter.username}
                        </li>
                    })}
                </ul>
            </div>
        </React.Fragment>
    };

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Boulder ({boulders.length})</h1>

            <Table columns={columns} data={boulders}/>

            <Drawer open={drawerOpen}
                    loading={detailsLoading}
                    closeHandler={toggleDrawer}
                    header={<DrawerHeader data={details}/>}
                    content={<DrawerContent data={details}/>}
            />
        </div>
    )
};

export default Index