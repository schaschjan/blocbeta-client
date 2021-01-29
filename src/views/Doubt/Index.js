import React, { Fragment, useContext } from "react";
import { queryCache, useMutation, useQuery } from "react-query";
import "./Index.css";
import { useApi } from "../../hooks/useApi";
import Emoji from "../../components/Emoji/Emoji";
import { LoadedContent } from "../../components/Loader/Loader";
import { Button } from "../../components/Button/Button";
import { errorToast, ToastContext } from "../../components/Toaster/Toaster";
import { getIcon } from "../../components/Ascent/Ascent";

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
              const AscentIcon = getIcon(doubt.ascent.type);

              return (
                <li className={"doubt-list__item"}>
                  <div>
                    <span>
                      <strong>{doubt.author.username}</strong> doubts your{" "}
                      <AscentIcon />({doubt.ascent.type}) of{" "}
                      {doubt.boulder.name}
                    </span>

                    <span>
                      <strong> Message:</strong> {doubt.author.message}
                    </span>
                  </div>

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
