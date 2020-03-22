import React, {useMemo, useState, useEffect} from 'react';
import ApiClient from "../../ApiClient";
import {Loader} from "../../components/Loader/Loader";
import {useTable, useSortBy} from "react-table";
import {TableCell, TableHeader, TableRow} from "../../components/Table/Table";
import Avatar from "../../components/Avatar/Avatar";
import Paragraph from "../../components/Paragraph/Paragraph";
import moment from "moment";
import "./Current.css"
import Icon from "../../components/Icon/Icon";
import Button from "../../components/Button/Button";
import classnames from "classnames";
import Context from "../../Context";

const Progress = ({percentage}) => {

    return (
        <div
            className={classnames("progress", percentage > 66 ? "progress--success" : percentage > 33 ? "progress--warning" : "progress--danger")}>
            <div style={{width: `${percentage}%`}}/>
        </div>
    )
};

const Table = ({columns, data}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
            columns,
            data
        },
        useSortBy
    );

    return (
        <div className={classnames('table', 'table--ranking')} {...getTableProps()}>
            <TableHeader headerGroups={headerGroups}/>

            <div className="table-content" {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);

                    return (
                        <TableRow>
                            {row.cells.map(cell => {
                                return <TableCell {...cell.getCellProps({className: cell.column.className})}>{cell.render('Cell')}</TableCell>
                            })}
                        </TableRow>
                    )
                })}
            </div>
        </div>
    )
};


const Current = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const columns = useMemo(
        () => [
            {
                Header: 'Rank',
                accessor: 'rank',
                Cell: ({cell}) => {
                    return <strong>{cell.value}</strong>
                }
            },
            {
                Header: 'User',
                accessor: 'user.username',
                Cell: ({cell, row}) => {
                    return <div className="user-cell">
                        <Avatar image={row.original.user.media}/>
                        {cell.value}
                    </div>
                }
            },
            {
                Header: 'Gender',
                accessor: 'user.gender',
                Cell: ({cell}) => {
                    return <Icon name={cell.value}/>
                }
            },
            {
                Header: 'Score',
                accessor: 'score',
            },
            {
                Header: 'Boulders',
                accessor: 'boulders',
                Cell: ({cell}) => {
                    const percentage = (cell.value / Context.storage.boulders.all().length) * 100;

                    return (
                        <Progress percentage={percentage}/>
                    )
                }
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
                Cell: ({cell}) => {
                    return (
                        <Paragraph>{moment(cell.value).fromNow()}</Paragraph>
                    )
                }
            },
            {
                Header: '',
                id: 'user.id',
                Cell: ({cell}) => {
                    return <Button text={true}>Compare</Button>
                }
            }
        ],
        []
    );

    useEffect(() => {
        ApiClient.rankings.current().then(data => {
            data.map((result, rank) => {
                rank++;

                if (rank <= 10) {
                    return result.rank = `0${rank}`;
                }

                return result.rank = rank.toString();
            });

            setData(data);
            console.log(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loader/>;

    return (
        <div className="container">
            <h1>Current Ranking</h1>
            <Table data={data} columns={columns}/>
        </div>
    )
};

export default Current;