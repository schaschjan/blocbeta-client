import React, { Fragment } from "react";
import Container from "../../components/Container/Container";
import { PageHeader } from "../../components/PageHeader/PageHeader";
import useApi, { api } from "../../hooks/useApi";
import { Loader } from "../../components/Loader/Loader";
import "./Settings.css";
import Button from "../../components/Button/Button";
import Wrapper from "../../components/Wrapper/Wrapper";
import { queryCache, useMutation } from "react-query";
import { toast } from "react-toastify";
import { alphaSort } from "../../helpers/helpers";

const Setters = () => {
  const { status, data } = useApi("setters", api.setters.all);

  const [revokeSetter] = useMutation(api.setters.revoke, {
    throwOnError: true,
    onSuccess: () => {
      queryCache.refetchQueries("setters");
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
          {alphaSort(data, "username").map((setter) => {
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

const Settings = () => {
  return (
    <Container>
      <PageHeader title={`Settings`} />

      <Wrapper>
        <Setters />
      </Wrapper>
    </Container>
  );
};

export default Settings;
