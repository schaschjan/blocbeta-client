import React, { useMemo, Fragment, useContext } from "react";
import { useQuery, useMutation, queryCache } from "react-query";
import { LoadedContent } from "../../components/Loader/Loader";
import EmptyState from "../../components/EmptyState/EmptyState";
import {
  cache,
  extractErrorMessage,
  mutationDefaults,
  useApi,
} from "../../hooks/useApi";
import {
  CrudTable,
  EditableCellSwitch,
} from "../../components/CrudTable/CrudTable";
import { toast, ToastContext } from "../../components/Toaster/Toaster";
import { sortItemsAlphabetically } from "../../helper/sortItemsAlphabetically";

const Index = () => {
  const { dispatch } = useContext(ToastContext);
  const { status, data } = useQuery(cache.setters, useApi("setters"));

  const [
    mutateUpdate,
    { status: mutateUpdateStatus, error: mutateUpdateError },
  ] = useMutation(useApi("updateSetter"), {
    ...mutationDefaults,
    onSuccess: () => {
      queryCache.invalidateQueries(cache.setters);
    },
  });

  const columns = useMemo(() => {
    return [
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Active",
        accessor: "active",
        Cell: EditableCellSwitch,
      },
    ];
  }, []);

  const handleUpdate = async (rowIndex, columnId, value) => {
    const payload = {
      ...data[rowIndex],
      [columnId]: value,
    };

    const { id } = payload;

    delete payload.id;

    try {
      await mutateUpdate({
        id,
        payload,
      });

      dispatch(toast("Update successful", null, "success"));
    } catch (error) {
      dispatch(toast("Error", extractErrorMessage(error), "danger"));
    }
  };

  return (
    <Fragment>
      <h1 className="t--alpha page-title">Setter</h1>

      <LoadedContent loading={status === "loading"}>
        <EmptyState isEmpty={!data || data.length === 0}>
          <CrudTable
            data={data && sortItemsAlphabetically(data, "username")}
            updateHandler={handleUpdate}
            columns={columns}
          />
        </EmptyState>
      </LoadedContent>
    </Fragment>
  );
};

export { Index };
