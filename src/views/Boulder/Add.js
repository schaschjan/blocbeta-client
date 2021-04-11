import React, { Fragment } from "react";
import { Meta } from "../../App";
import { BoulderForm } from "../../components/BoulderForm/BoulderForm";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";
import { mutate } from "swr";
import { useApi, useUri } from "../../hooks/useRequest";

const Add = () => {
  const create = useApi(`/boulder`, true, { method: "post" });
  const boulderApiUrl = useUri(`/boulder`);

  const onSubmit = async ({ payload }) => {
    await create(payload);
    mutate(boulderApiUrl);
  };

  return (
    <Fragment>
      <Meta title="Add boulder" />

      <div className={layouts.side}>
        <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
          Add a new boulder.
        </h1>

        <div className={layouts.sideContent}>
          <BoulderForm successMessage={"Boulder created"} onSubmit={onSubmit} />
        </div>
      </div>
    </Fragment>
  );
};

export { Add };
