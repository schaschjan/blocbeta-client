import React, { Fragment, useContext } from "react";
import "./Index.css";
import Emoji from "../../components/Emoji/Emoji";
import { Loader } from "../../components/Loader/Loader";
import { Button } from "../../components/Button/Button";
import { errorToast, ToastContext } from "../../components/Toaster/Toaster";
import { Ascent, AscentIcon, getIcon } from "../../components/Ascent/Ascent";
import { useHttp, useRequest } from "../../hooks/useRequest";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";
import { mutate } from "swr";

const Index = () => {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const { dispatch } = useContext(ToastContext);
  const { data } = useRequest("/doubt");
  const http = useHttp();

  if (!data) {
    return <Loader />;
  }

  return (
    <Fragment>
      <h1 className="t--alpha page-title">Doubts</h1>

      {data.length > 0 ? (
        <ul className={"doubt-list"}>
          {data.map((doubt) => {
            return (
              <li className={"doubt-list__item"}>
                <div>
                  <p>
                    <strong>{doubt.author.username}</strong> doubts your
                    <AscentIcon fill={true} type={doubt.ascent.type} /> of{" "}
                    {doubt.boulder.name}
                  </p>

                  <p>{doubt.author.message}</p>
                </div>

                <Button
                  variant="primary"
                  size="small"
                  onClick={async () => {
                    try {
                      await http.put(`/doubt/${doubt.id}`, {
                        status: 2,
                      });

                      await mutate(contextualizedApiPath("/doubt"));
                    } catch (error) {
                      dispatch(errorToast(error));
                    }
                  }}
                >
                  Resolve
                </Button>
              </li>
            );
          })}
        </ul>
      ) : (
        <h2 className="t--gamma">
          <Emoji>🤷</Emoji>
        </h2>
      )}
    </Fragment>
  );
};

export { Index };
