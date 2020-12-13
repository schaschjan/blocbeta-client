import React, { Fragment } from "react";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import useApi, { api, cache } from "../../hooks/useApi";
import { Loader } from "../../components/Loader/Loader";
import "./Index.css";
import Button from "../../components/Button/Button";
import { queryCache, useMutation } from "react-query";
import { toast } from "react-toastify";
import { sortItemsAlphabetically } from "../../helper/sortItemsAlphabetically";

const Setters = () => {
  const { status, data } = useApi(cache.setters, api.setters.all);

  const [revokeSetter] = useMutation(api.setters.revoke, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.refetchQueries(cache.setters);
    },
  });

  const onRevokeSetter = async ({ username, id }) => {
    if (window.confirm(`Confirm removal of setter ${username}`)) {
      try {
        await revokeSetter(id);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Fragment>
      <h2>Setters</h2>

      {status === "loading" ? (
        <Loader />
      ) : (
        <ul className="setter-list">
          {sortItemsAlphabetically(data, "username").map((setter) => {
            return (
              <li key={setter.id}>
                <span>{setter.username}</span>
                <Button
                  dangerous={true}
                  size={"small"}
                  onClick={() => onRevokeSetter(setter)}
                >
                  Revoke
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </Fragment>
  );
};

const Index = () => {
  return (
    <Fragment>
      <PageHeader title={`Settings`} />

      <Setters />
    </Fragment>
  );
};

export { Index };
