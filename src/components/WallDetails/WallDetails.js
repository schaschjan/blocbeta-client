import React, { Fragment } from "react";
import styles from "./WallDetails.module.css";
import { joinClassNames } from "../../helper/classNames";
import { Close } from "../Icon/Close";
import { useRequest } from "../../hooks/useRequest";
import { Loader } from "../Loader/Loader";

function WallDetails({ wall, onClose }) {
  const { data } = useRequest(`/wall/${wall.id}`);

  return (
    <div className={styles.root}>
      <div className={styles.close}>
        <Close onClick={onClose} />
      </div>

      <div className={styles.inner}>
        <div>
          <img className={styles.map} src={wall.media} alt={"map"} />
        </div>

        <div>
          {data ? (
            <Fragment>
              <h2>{data.name}</h2>
              <p>{data.description}</p>
              <p>{data.active_boulders} active boulders</p>
            </Fragment>
          ) : (
            <Loader />
          )}
        </div>
      </div>

      <div className={joinClassNames(styles.background)} />
    </div>
  );
}

export { WallDetails };
