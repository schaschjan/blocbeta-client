import React, { Fragment, useContext } from "react";
import { Meta } from "../../App";
import { BoulderForm } from "../../components/BoulderForm/BoulderForm";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import { joinClassNames } from "../../helper/classNames";
import { mutate } from "swr";
import { useHttp } from "../../hooks/useRequest";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";

const Add = () => {
  const { contextualizedApiPath } = useContext(BoulderDBUIContext);
  const http = useHttp();

  const onSubmit = async ({ payload }) => {
    await http.post("/boulder", payload);

    await mutate(contextualizedApiPath("/boulder"));
    await mutate(contextualizedApiPath("/ascent"));
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
