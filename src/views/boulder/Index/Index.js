import React, {useState, useEffect, Fragment} from 'react';
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
import {useDrawerState} from "../../../helpers/drawer.state";
import Banner from "../../../components/Banner/Banner";

const Index = () => {
    const [boulders, setBoulders] = useState(null);
    const [loading, setLoading] = useState(true);
    const {toggle, setHeader, setContent} = useDrawerState();

    const ColorFilter = ({column: {filterValue, setFilter, preFilteredRows, id}}) => {
        setFilter('poop');
    };


    const columns = [
        {
            Header: 'Color',
            accessor: 'color.name',
            Cell: ({cell}) => {
                return <HoldStyle name={cell.value}/>
            },
            Filter: ColorFilter,
            filter: () => {
                return 'poop'
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
            filter: "text",
            Cell: ({cell}) => {
                return <Paragraph>{cell.value}</Paragraph>
            }
        },
        {
            Header: 'End',
            accessor: 'endWall.name',
            Cell: ({cell}) => {
                return <Paragraph>{cell.value}</Paragraph>
            }
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

    const renderDrawerHeader = (data) => {
        return <React.Fragment>
            <HoldStyle name={data.color.name}/>
            <h3>{data.name}</h3>
        </React.Fragment>
    };

    const renderDrawerContent = (data) => {
        return <React.Fragment>
            {data.tags.length > 0 &&
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
            }

            <div className="detail__list">
                <h4>Ascents ({data.ascents.length ? data.ascents.length : 0})</h4>

                {data.ascents.length > 0 &&
                <ul>
                    {data.ascents.map(ascent => {
                        return <li>
                            <Icon name={ascent.type}/>
                            {ascent.user.username}
                            <Button text={true}>Doubt it</Button>
                        </li>
                    })}
                </ul>
                }
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

            <Button text={true} className="report-error">Report error</Button>
        </React.Fragment>
    };

    const triggerDetail = async (boulderId) => {
        const boulder = await ApiClient.getBoulder(boulderId);
        await resolveBoulder(boulder);

        toggle();
        setHeader(renderDrawerHeader(boulder));
        setContent(renderDrawerContent(boulder));
    };

    if (loading) return <Loader/>;

    return (
        <Fragment>
            <Banner>
                <Paragraph>
                    Logowand <strong>・NEW NEW NEW・</strong>
                </Paragraph>
            </Banner>

            <div className="container">
                <h1>Boulder ({boulders.length})</h1>

                <Table columns={columns} data={boulders} className="table--boulder"/>
            </div>
        </Fragment>
    )
};

export default Index