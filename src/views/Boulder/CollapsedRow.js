import { SwipeOut } from "../../components/SwipeOut/SwipeOut";
import { joinClassNames } from "../../helper/classNames";
import styles from "./CollapsedRow.module.css";
import typography from "../../css/typography.module.css";
import React, { useContext } from "react";
import { AscentIcon } from "../../components/Ascent/Ascent";
import { Link } from "react-router-dom";
import { BoulderDBUIContext } from "../../components/BoulderDBUI";

function CollapsedRow({ cells }) {
  const { contextualizedPath, isAdmin } = useContext(BoulderDBUIContext);

  const ascentCell = cells.find((cell) => cell.column.id === "ascent");
  const holdTypeCell = cells.find((cell) => cell.column.id === "holdType");
  const starWallCell = cells.find((cell) => cell.column.id === "start");
  const endWallCell = cells.find((cell) => cell.column.id === "end");
  const nameCell = cells.find((cell) => cell.column.id === "name");
  const gradeCell = cells.find((cell) => cell.column.id === "grade");

  const boulderId = cells[0].row.original.id;

  return (
    <SwipeOut
      className={styles.root}
      hiddenChildren={
        <div className={styles.ascents}>{ascentCell.render("Cell")}</div>
      }
    >
      <div className={joinClassNames(styles.inner, typography.eta)}>
        <div>{holdTypeCell.render("Cell")}</div>

        <div className={styles.meta}>
          <div className={joinClassNames(styles.name, styles.metaItem)}>
            {isAdmin && (
              <Link
                to={contextualizedPath(`/admin/boulder/${boulderId}`)}
                className={styles.editLink}
              >
                ✎
              </Link>
            )}

            {nameCell.render("Cell")}
          </div>

          <div className={joinClassNames(styles.wallNames, styles.metaItem)}>
            {starWallCell.render("Cell")} > {endWallCell.render("Cell")}
          </div>

          <div className={joinClassNames(styles.metaItem)}>
            {gradeCell.render("Cell")}
          </div>
        </div>

        <div className={styles.ascent}>
          <AscentIcon type={ascentCell?.value?.type} fill={true} />
        </div>
      </div>
    </SwipeOut>
  );
}

export { CollapsedRow };
