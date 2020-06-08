import React from "react";
import { alphaSort } from "../helpers";
import Emoji from "../components/Emoji/Emoji";

const useTagOptions = (items) => {
  if (!items) {
    return null;
  }

  return alphaSort(items, "name").map((tag) => {
    return {
      label: (
        <span>
          <Emoji>{tag.emoji}</Emoji> {tag.name}
        </span>
      ),
      value: tag.id,
    };
  });
};

export default useTagOptions;
