import React, { Fragment, useContext } from "react";
import "./Current.css";
import useApi, { api, cache } from "../../hooks/useApi";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import { useParams } from "react-router-dom";
import { AppContext, Meta } from "../../App";
import { getIcon } from "../../components/Ascent/Ascent";

const Current = () => {
  const { a, b } = useParams();
  const { user } = useContext(AppContext);

  const { status: comparisonStatus, data: comparisons } = useApi(
    [cache.compare, b],
    () => api.compare.current(a, b)
  );
  const { status: compareUserStatus, data: compareUser } = useApi(
    [cache.user, b],
    () => api.user.show(b)
  );
  const { status: bouldersStatus, data: boulders } = useApi(
    cache.boulder,
    api.boulder.active
  );
  const { status: wallsStatus, data: walls } = useApi(
    cache.walls,
    api.walls.all
  );
  const { status: gradesStatus, data: grades } = useApi(
    cache.grades,
    api.grades.all
  );
  const { status: holdTypesStatus, data: holdTypes } = useApi(
    cache.holdTypes,
    api.holdTypes.all
  );

  const columns = [
    // {
    //   id: "holdType",
    //   Header: "holdType",
    //   accessor: "holdType.name",
    //   className: `table-cell--holdType`,
    //   Cell: ({ row }) => {
    //     return (
    //         <HoldStyle
    //             name={row.original.holdType.name}
    //             icon={row.original.holdType.icon}
    //         />
    //     );
    //   },
    // },
    // {
    //   id: "grade",
    //   Header: "Grade",
    //   accessor: "grade.name",
    //   className: `table-cell--grade`,
    //   Cell: ({ row }) => {
    //     return (
    //         <Grade
    //             name={row.original.grade.name}
    //             color={row.original.grade.color}
    //         />
    //     );
    //   },
    // },
    {
      id: "points",
      Header: "Points",
      accessor: "points",
      className: `table-cell--points`,
      Cell: ({ cell }) => <span>{cell.value} pts</span>,
    },
    {
      Header: "Name",
      accessor: "boulder.name",
    },
    {
      id: "start",
      Header: "Start",
      accessor: "boulder.startWall.name",
    },
    {
      id: "end",
      Header: "End",
      accessor: "boulder.endWall.name",
    },
    {
      Header: user.username,
      accessor: "a",
      Cell: ({ cell }) => {
        return getIcon(cell.value);
      },
    },
    {
      Header: compareUser.username,
      accessor: "b",
      Cell: ({ cell }) => {
        return getIcon(cell.value);
      },
    },
    {
      Header: "Comparison",
      Cell: ({ cell }) => {
        const { positionA, positionB } = cell.row.original;

        if (positionA > positionB) {
          return <span>+</span>;
        }

        if (positionA < positionB) {
          return <span>-</span>;
        }

        return <span>=</span>;
      },
    },
  ];

  return (
    <Fragment>
      <Meta title={"Compare"} />
      <PageHeader title={"Compare"} />
    </Fragment>
  );
};

export { Current };
