import React, {useState, useEffect} from 'react';
import {Loader} from "../../components/Loader/Loader";
import ApiClient from "../../ApiClient";
import {useParams} from "react-router-dom";
import db from "../../db";
import {concatToList, resolveBoulder} from "../../Helpers";
import Grade from "../../components/Grade/Grade";
import HoldStyle from "../../components/HoldStyle/HoldStyle";
import Icon from "../../components/Icon/Icon";
import Table from "../../components/Table/Table";

const Current = () => {
        const [data, setData] = useState(null);
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);

        let {a, b} = useParams();

        useEffect(() => {
            async function getData() {
                const comparisons = await ApiClient.getCurrentComparison(a, b);

                for (let comparison of comparisons) {

                    const boulder = await db.boulders.get(comparison.subject);
                    await resolveBoulder(boulder);

                    comparison.subject = boulder;
                }

                return comparisons;
            }

            getData().then(data => {
                setData(data);

                ApiClient.getUser(b).then((data) => {
                    setUser(data);
                }).then(() => {
                    setLoading(false);
                })
            });

        }, [a, b]);

        if (loading) return <Loader/>;

        const columns = [
            {
                Header: 'Name',
                accessor: 'subject.name',
            },
            {
                Header: 'Color',
                accessor: 'subject.color.name',
                Cell: ({cell}) => {
                    return <HoldStyle name={cell.value}/>
                }
            },
            {
                Header: 'Grade',
                accessor: 'subject.grade',
                Cell: ({cell}) => {
                    return <Grade name={cell.value.name} color={cell.value.color}/>
                }
            },
            {
                Header: 'Start',
                accessor: 'subject.startWall.name',
            },
            {
                Header: 'End',
                accessor: 'subject.endWall.name',
            },
            {
                Header: 'Setters',
                accessor: (row) => concatToList(row.subject.setters, 'username')
            },
            {
                Header: 'Tags',
                accessor: (row) => {
                    return row.subject.tags.map(tag => tag.emoji)
                }
            },
            {
                Header: user.username,
                accessor: 'b',
                Cell: ({cell}) => {
                    return <Icon name={cell.value}/>
                }
            },
            {
                Header: 'Me',
                accessor: 'a',
                Cell: ({cell}) => {
                    return <Icon name={cell.value}/>
                }
            }
        ];

        return (
            <div className="container">
                <h1>Compare</h1>

                <Table columns={columns} data={data}/>
            </div>
        )
    }
;

export default Current