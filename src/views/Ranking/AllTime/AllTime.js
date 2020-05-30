import useApi, {api, cacheKeys} from "../../../hooks/useApi";
import Container from "../../../components/Container/Container";
import {PageHeader} from "../../../components/PageHeader/PageHeader";
import Wrapper from "../../../components/Wrapper/Wrapper";
import EmptyState from "../../../components/EmptyState/EmptyState";
import Emoji from "../../../components/Emoji/Emoji";
import React, {Fragment} from "react";
import {Loader} from "../../../components/Loader/Loader";
import RankingTable from "../../../components/RankingTable/RankingTable";
import Avatar from "../../../components/Avatar/Avatar";
import Progress from "../../../components/Progress/Progress";
import {getPercentage} from "../../../helpers";

const AllTime = () => {
    const {status: rankingStatus, data: ranking} = useApi(
        cacheKeys.ranking.allTime,
        api.ranking.allTime
    );

    const { status: bouldersStatus, data: boulders } = useApi(
        cacheKeys.boulders,
        api.boulder.active
    );

    if ([rankingStatus, bouldersStatus].includes("loading")) return <Loader />;

    const columns = [
        {
            Header: "Rank",
            accessor: "rank",
            className: `table-cell--rank`,
            Cell: ({cell}) => {
                return <strong>{cell.value}</strong>;
            },
        },
        {
            Header: "Boulders",
            accessor: "boulders",
            className: "table-cell--boulders",
            Cell: ({cell}) => {
                const percentage = (cell.value / boulders.length) * 100;

                return <Progress percentage={percentage}/>;
            },
        },
        {
            Header: "Flashed",
            accessor: "flashes",
            Cell: ({cell}) => getPercentage(cell.value, boulders.length),
        },
        {
            Header: "Topped",
            accessor: "tops",
            Cell: ({cell}) => getPercentage(cell.value, boulders.length),
        },
        {
            Header: "User",
            accessor: "user.username",
            className: "table-cell--user",
            Cell: ({ cell, row }) => {
                return (
                    <Fragment>
                        {/*<Avatar user={row.original.user} />*/}
                        {cell.value}
                    </Fragment>
                );
            },
        }
    ];

    return (
        <Container>
            <PageHeader title={"All time ranking"}/>

            <Wrapper>
                {ranking.length > 0 ? (
                    <RankingTable data={ranking} columns={columns} className={"all-time"}/>
                ) : (
                    <EmptyState>
                        <h2>
                            No one here… <Emoji>🤷</Emoji>
                        </h2>
                    </EmptyState>
                )}
            </Wrapper>
        </Container>
    );
};

export default AllTime