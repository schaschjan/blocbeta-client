import React, {useMemo, Fragment, useContext} from "react";
import {useQuery} from "react-query";
import {LoadedContent} from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import {useApi} from "../../hooks/useApi";
import {BlocBetaUIContext} from "../../components/BlocBetaUI";
import {CrudTable} from "../../components/CrudTable/CrudTable";
import {Button} from "../../components/Button/Button";

export default () => {
  const {contextualizedPath} = useContext(BlocBetaUIContext);
  const {status, data} = useQuery("rooms", useApi("rooms"));

  const columns = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "",
        accessor: "id",
        Cell: ({value}) => (
          <Button asLink={true}
                  size="small"
                  to={contextualizedPath(`/admin/rooms/${value}`)}>
            Detail
          </Button>
        )
      }
    ]
  }, []);

  return <Fragment>
    <h1 className="t--alpha page-title">
      Rooms
    </h1>

    <LoadedContent loading={status === "loading"}>
      <EmptyState isEmpty={!data || data.length === 0}>

        <CrudTable data={data} columns={columns}/>

      </EmptyState>
    </LoadedContent>
  </Fragment>
};
