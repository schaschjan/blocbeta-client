import React, { Fragment } from "react";
import { Meta } from "../../App";
import { BoulderForm } from "../../components/BoulderForm/BoulderForm";
import { useParams } from "react-router-dom";
import { useApi, useRequest, useUri } from "../../hooks/useRequest";
import { Loader } from "../../components/Loader/Loader";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";
import { mutate } from "swr";

const Edit = () => {
  const { boulderId } = useParams();

  const bouldersKey = useUri("/boulder");
  const ascentsKey = useUri("/ascent");

  const { data, mutate: mutateBoulder } = useRequest(`/boulder/${boulderId}`);
  const update = useApi(`/boulder/${boulderId}`, true, { method: "put" });

  const onSubmit = async ({ payload }) => {
    await update(payload);

    await mutateBoulder();
    await mutate(bouldersKey);
    await mutate(ascentsKey);
  };

  if (!data) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Meta title={`Edit ${data.name}`} />

      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Edit {data.name}
        </h1>

        <div className={joinClassNames(layouts.sideContent)}>
          <BoulderForm
            successMessage={"Boulder updated"}
            onSubmit={onSubmit}
            id={boulderId}
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
              status: "active",
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export { Edit };
