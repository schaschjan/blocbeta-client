import React, {useState, useEffect} from 'react';
import {Loader} from "../../components/Loader";
import db from "../../db";
import Context from "../../Context";
import {Table} from "../../Helpers";
import ApiClient from "../../ApiClient";

const AdminTable = (data) => {

    const columns = [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Color',
            accessor: 'color.name',
        },
        {
            Header: 'Grade',
            accessor: 'grade.name',
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
            Header: 'Me',
            accessor: 'me.type',
        }
    ];

    return <Table columns={columns} data={data.data}/>

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