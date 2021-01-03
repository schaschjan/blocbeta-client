import React, { Fragment, useContext } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import "./Index.css";
import { useApi } from "../../hooks/useApi";
import Emoji from "../../components/Emoji/Emoji";
import { LoadedContent } from "../../components/Loader/Loader";
import { Button } from "../../components/Button/Button";
import { errorToast, ToastContext } from "../../components/Toaster/Toaster";

const Index = () => {
  const { dispatch } = useContext(ToastContext);

  const { status: doubtsStatus, data: doubts } = useQuery(
    "doubts",
    useApi("doubts")
  );

  const [mutateUpdate] = useMutation(useApi("updateDoubt"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries("doubts");
    },
  });

  return (
    <Fragment>
      <h1 className="t--alpha page-title">Doubts</h1>

      <LoadedContent loading={doubtsStatus === "loading"}>
        {doubts && doubts.length > 0 ? (
          <ul className={"doubt-list"}>
            {doubts.map((doubt) => {
              return (
                <li className={"doubt-list__item"}>
                  <span>
                    {doubt.username} doubted your "flash" on {doubt.name}
                  </span>

                  <span>{doubt.description}</span>

                  <Button
                    variant="primary"
                    size="small"
                    onClick={async () => {
                      try {
                        await mutateUpdate({
                          id: doubt.id,
                          payload: { status: 2 },
                        });
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
      </LoadedContent>
    </Fragment>
  );
};

export { Index };
