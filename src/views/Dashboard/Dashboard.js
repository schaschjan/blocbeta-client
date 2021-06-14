import React, { useContext } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import layouts from "../../css/layouts.module.css";
import typography from "../../css/typography.module.css";
import styles from "./Dashboard.module.css";
import { joinClassNames } from "../../helper/classNames";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";

const Dashboard = () => {
  const { contextualizedPath, user } = useContext(BoulderDBUIContext);

  return (
    <div className={layouts.side}>
      <h1 className={joinClassNames(layouts.sideTitle, typography.alpha)}>
        Welcome back {user.username} 👋
      </h1>

      <div className={layouts.sideContent}>
        <div className={styles.links}>
          <Link
            className={cn(styles.link, typography.alpha)}
            to={contextualizedPath("/schedule")}
          >
            <mark> Book a timeslot</mark>
          </Link>

          <br />

          <Link
            className={cn(styles.link, typography.alpha)}
            to={contextualizedPath("/boulder")}
          >
            List boulders
          </Link>

          <br />

          <Link
            className={cn(styles.link, typography.alpha)}
            to={contextualizedPath("/ranking/current")}
          >
            List ranking
          </Link>
        </div>
      </div>
    </div>
  );
};

export { Dashboard };
