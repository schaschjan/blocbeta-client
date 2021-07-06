import React, { Fragment } from "react";
import styles from "./WallDetails.module.css";
import { joinClassNames } from "../../helper/classNames";
import { Close } from "../Icon/Close";
import { useRequest } from "../../hooks/useRequest";
import { Loader } from "../Loader/Loader";

function WallDetails({ wall, onClose }) {
  const { data } = useRequest(`/wall/${wall.id}`);

  if (!data) {
    return <Loader />;
  }

  return (
    <div className={styles.root}>
      <div className={styles.close}>
        <Close onClick={onClose} />
      </div>

      <div className={styles.inner}>
        <div>
          <img className={styles.map} src={data.media} alt={"map"} />
        </div>

        <div>
          <h2>{data.name}</h2>
          <p>{data.description}</p>
          <p>{data.active_boulders} active boulders</p>
        </div>
      </div>

      <div className={joinClassNames(styles.background)} />
    </div>
  );
}

export { WallDetails };
