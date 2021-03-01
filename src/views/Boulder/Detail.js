import React, { Fragment, useContext } from "react";
import { cache, queryDefaults, useApi } from "../../hooks/useApi";
import { Meta } from "../../App";
import { BoulderForm } from "../../components/BoulderForm/BoulderForm";
import {
  errorToast,
  successToast,
  ToastContext,
} from "../../components/Toaster/Toaster";
import { queryCache, useQuery, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import { useHistory } from "react-router-dom";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";

const Detail = () => {
  const { contextualizedPath } = useContext(BoulderDBUIContext);
  const { boulderId } = useParams();
  const history = useHistory();

  const { status, data } = useQuery(
    [cache.boulder, { boulderId }],
    useApi("boulderDetail", { id: boulderId }),
    queryDefaults
  );

  const { dispatch } = useContext(ToastContext);

  const [mutate] = useMutation(useApi("updateBoulder"), {
    throwOnError: true,
    onSuccess: () => {
      queryCache.invalidateQueries([cache.boulder]);
    },
  });

  if (status === "loading") {
    return <Loader />;
  }

  return (
    <Fragment>
      <Meta title="Add boulder" />

      <div className="side-title-layout">
        <h1 className="t--alpha side-title-layout__title">
          Add a new boulder.
        </h1>

        <div className="side-title-layout__content">
          <BoulderForm
            submitLabel={"Update"}
            onSubmit={async (formData) => {
              try {
                await mutate({
                  payload: formData,
                  id: boulderId,
                });

                dispatch(successToast("Boulder updated"));
                history.push(contextualizedPath("/boulder"));
              } catch (error) {
                dispatch(errorToast(error));
              }
            }}
            data={{
              name: data.name,
              points: data.points,
              start_wall: data.start_wall.id,
              end_wall: data.end_wall ? data.end_wall.id : null,
              grade: data.grade.id,
              internal_grade: data.internal_grade.id,
              hold_type: data.hold_type.id,
              setters: data.setters.map((setter) => setter.id),
              tags: data.tags.map((tag) => tag.id),
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export { Detail };
