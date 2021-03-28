import React, { Fragment } from "react";
import styles from "./WallDetails.module.css";
import { joinClassNames } from "../../helper/classNames";
import { Close } from "../Icon/Close";
import useRequest from "../../hooks/useRequest";
import { Loader } from "../Loader/Loader";
import { Frame } from "framer";

function WallDetails({ wall, onClose }) {
  const { data } = useRequest(`/wall/${wall.id}`);
  console.log(data);

  return (
    <div className={styles.root}>
      <Close className={styles.close} onClick={onClose} />

      <div className={styles.inner}>
        <div>
          <img
            className={styles.map}
            src={
              "https://storage.boulderdb.de/boulderdb-uploads/99664c5b7f693662213fe8839e186757.jpeg"
            }
            alt={"map"}
          />
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
