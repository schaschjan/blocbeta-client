import React, { Fragment } from "react";
import { Loader } from "../../../components/Loader/Loader";
import { useTable, useSortBy, useGlobalFilter } from "react-table";
import {
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table/Table";
import Avatar from "../../../components/Avatar/Avatar";
import Paragraph from "../../../components/Paragraph/Paragraph";
import moment from "moment";
import "./Current.css";
import Icon from "../../../components/Icon/Icon";
import Button from "../../../components/Button/Button";
import classnames from "classnames";
import Search from "../../../components/Search/Search";
import Container from "../../../components/Container/Container";
import useApi, { api } from "../../../hooks/useApi";
import SwipeOut from "../../../components/SwipeOut/SwipeOut";
import { PageHeader } from "../../../components/PageHeader/PageHeader";

const Progress = ({ percentage }) => {
  const classes = classnames(
    "progress",
    percentage > 66
      ? "progress--success"
      : percentage > 33
      ? "progress--warning"
      : "progress--danger"
  );

  return (
    <div className={classes}>
      <div style={{ width: `${percentage}%` }} />
    </div>
  );
};

const Actions = <Button text={true}>Compare</Button>;

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div>
      <Search
        placeholder="Search for member"
        onClear={() => setGlobalFilter(null)}
        onInputChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
      />

      <div
        className={classnames("table", "table--ranking")}
        {...getTableProps()}
      >
        <TableHeader headerGroups={headerGroups} />

        <div className="table-content" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <SwipeOut actions={Actions}>
                <TableRow>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps({
                          className: cell.column.className,
                        })}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </SwipeOut>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Current = () => {
  const { status: rankingStatus, data: ranking } = useApi(
    "ranking-current",
    api.ranking.current
  );
  const { status: bouldersStatus, data: boulders } = useApi(
    "boulder",
    api.boulder.active
  );

  if ([rankingStatus, bouldersStatus].includes("loading")) return <Loader />;

  const percentageOfBoulders = (value) => {
    let percentage = 0;

    if (value > 0) {
      percentage = (value / boulders.length) * 100;
    }

    if (percentage === 0) {
      return `${value} (0%)`;
    }

    if (percentage < 1) {
      return `${value} (<1%)`;
    }

    return `${value} (${Math.floor(percentage)}%)`;
  };

  const columns = [
    {
      Header: "Rank",
      accessor: "rank",
      className: `table-cell--rank`,
      Cell: ({ cell }) => {
        return <strong>{cell.value}</strong>;
      },
    },
    {
      Header: "User",
      accessor: "user.username",
      className: "table-cell--user",
      Cell: ({ cell, row }) => {
        return (
          <Fragment>
            <Avatar image={row.original.user.media} />
            {cell.value}
          </Fragment>
        );
      },
    },
    {
      Header: "Gender",
      accessor: "user.gender",
      Cell: ({ cell }) => {
        return <Icon name={cell.value} />;
      },
    },
    {
      Header: "Score",
      accessor: "score",
    },
    {
      Header: "Boulders",
      accessor: "boulders",
      className: "table-cell--boulders",
      Cell: ({ cell }) => {
        const percentage = (cell.value / boulders.length) * 100;

        return <Progress percentage={percentage} />;
      },
    },
    {
      Header: "Flashed",
      accessor: "flashes",
      Cell: ({ cell }) => percentageOfBoulders(cell.value),
    },
    {
      Header: "Topped",
      accessor: "tops",
      Cell: ({ cell }) => percentageOfBoulders(cell.value),
    },
    {
      Header: "Last activity",
      accessor: "user.lastActivity",
      Cell: ({ cell }) => {
        return <Paragraph>{moment(cell.value).fromNow()}</Paragraph>;
      },
    },
    {
      Header: "",
      id: "user.id",
      className: "table-cell--actions",
      Cell: () => Actions,
    },
  ];

  return (
    <Container>
      <PageHeader title={"Current Ranking"} />
      <Table data={ranking} columns={columns} />
    </Container>
  );
};

export default Current;