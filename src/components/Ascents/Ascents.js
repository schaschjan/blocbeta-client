import React from "react";
import { Ascent } from "../Ascent/Ascent";
import styles from "./Ascents.module.css";

const Ascents = ({ boulderId, ascent, removeHandler, addHandler }) => {
  return (
    <div className={styles.root}>
      <Ascent
        type="flash"
        disabled={ascent.id && ascent.type !== "flash"}
        checked={ascent.type === "flash"}
        asyncHandler={async () => {
          ascent.id
            ? await removeHandler(ascent.id)
            : await addHandler(boulderId, "flash");
        }}
      />

      <Ascent
        type="top"
        disabled={ascent.id && ascent.type !== "top"}
        checked={ascent.type === "top"}
        asyncHandler={async () => {
          ascent.id
            ? await removeHandler(ascent.id)
            : await addHandler(boulderId, "top");
        }}
      />

      <Ascent
        type="resignation"
        disabled={ascent.id && ascent.type !== "resignation"}
        checked={ascent.type === "resignation"}
        asyncHandler={async () => {
          ascent.id
            ? await removeHandler(ascent.id)
            : await addHandler(boulderId, "resignation");
        }}
      />
    </div>
  );
};

export { Ascents };
