import React, {useState, useEffect} from 'react';
import moment from "moment";
import ApiClient from "../../ApiClient";
import {Loader} from "../../components/Loader";
import {Table} from "../../Helpers";

const Current = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const columns = React.useMemo(
        () => [
            {
                Header: 'User',
                accessor: 'user.username',
            },
            {
                Header: 'Score',
                accessor: 'score',
            },
            {
                Header: 'Boulders',
                accessor: 'boulders',
            },
            {
                Header: 'Flashes',
                accessor: 'flashes',
            },
            {
                Header: 'Tops',
                accessor: 'tops',
            },
            {
                Header: 'Last activity',
                accessor: 'user.lastActivity',
                Cell: ({row}) => {
                    return moment(row.original.user.lastActivity, "YYYY-MM-DD hh:mm:ss.u").fromNow();
                }
            }
        ], []
    );

    useEffect(() => {
        ApiClient.getCurrentRanking().then(data => {
            setData(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Current Ranking</h1>

            <Table columns={columns} data={data}/>
        </div>
    )
};

export default Current;