// import React, {useState, useEffect} from 'react';
// import moment from "moment";
// import ApiClient from "../../ApiClient";
// import {Loader} from "../../components/Loader/Loader";
// import {Link} from "react-router-dom";
// import Context from "../../Context";
// import Table from "../../components/Table/Table";
// import Avatar from "../../components/Avatar/Avatar";
// import "./Current.css"
// import Paragraph from "../../components/Paragraph/Paragraph";
// import Button from "../../components/Button/Button";
//
// const Current = () => {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//
//     const columns = React.useMemo(
//         () => [
//             {
//                 Header: 'User',
//                 accessor: 'user.username',
//                 Cell: ({cell, row}) => {
//
//                     return <div className="user-cell">
//                         <Avatar image={row.original.user.media}/>
//                         {cell.value}
//                     </div>
//                 }
//             },
//             {
//                 Header: 'Score',
//                 accessor: 'score',
//             },
//             {
//                 Header: 'Boulders',
//                 accessor: 'boulders',
//             },
//             {
//                 Header: 'Flashes',
//                 accessor: 'flashes',
//             },
//             {
//                 Header: 'Tops',
//                 accessor: 'tops',
//             },
//             {
//                 Header: 'Last activity',
//                 accessor: 'user.lastActivity',
//                 Cell: ({cell}) => {
//                     return (
//                         <Paragraph>{moment(cell.value).format('D MMM')}</Paragraph>
//                     )
//                 }
//             },
//             {
//                 accessor: 'user.id',
//                 Cell: ({cell}) => {
//                     return (
//                         <div className="actions-cell">
//                             <Button text={true}
//                                     to={Context.getPath(`/compare/${Context.getUserId()}/to/${cell.value}/at/current`)}>
//                                 Compare
//                             </Button>
//                         </div>
//                     )
//                 }
//             }
//         ], []
//     );
//
//     useEffect(() => {
//         ApiClient.getCurrentRanking().then(data => {
//             setData(data);
//             setLoading(false);
//         });
//     }, []);
//
//     if (loading) return <Loader/>;
//
//     return (
//         <div className="container">
//             <h1>Current Ranking</h1>
//
//             <Table columns={columns}
//                    data={data}
//                    className="table--ranking"
//                    pager={false}/>
//         </div>
//     )
// };
//
// export default Current;