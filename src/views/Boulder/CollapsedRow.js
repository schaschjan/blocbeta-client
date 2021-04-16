import { SwipeOut } from "../../components/SwipeOut/SwipeOut";
import { joinClassNames } from "../../helper/classNames";
import styles from "./CollapsedRow.module.css";
import typography from "../../css/typography.module.css";
import React from "react";

function CollapsedRow({ cells }) {
  const ascentCell = cells.find((cell) => cell.column.id === "ascent");
  const holdTypeCell = cells.find((cell) => cell.column.id === "holdType");
  const starWallCell = cells.find((cell) => cell.column.id === "start");
  const endWallCell = cells.find((cell) => cell.column.id === "end");
  const nameCell = cells.find((cell) => cell.column.id === "name");

  return (
    <SwipeOut
      hiddenChildren={
        <div className={styles.ascent}>{ascentCell.render("Cell")}</div>
      }
    >
      <div className={joinClassNames(styles.root, typography.eta)}>
        <div>{holdTypeCell.render("Cell")}</div>

        <div className={styles.meta}>
          <p className={styles.name}>{nameCell.render("Cell")}</p>

          <p className={styles.wallNames}>
            {starWallCell.render("Cell")} > {endWallCell.render("Cell")}
          </p>
        </div>
      </div>
    </SwipeOut>
  );
}

export { CollapsedRow };
