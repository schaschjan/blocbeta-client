import React from "react";
import { alphaSort } from "../helpers";
import Emoji from "../components/Emoji/Emoji";
import useApi, { cacheKeys } from "./useApi";
import HoldStyle from "../components/HoldStyle/HoldStyle";

const useApiResourceSelectOptions = (cacheKey, apiMethod) => {
  const { status, data } = useApi(cacheKey, apiMethod);

  if (status === "loading" || !data) {
    return [];
  }

  if (cacheKey === cacheKeys.setters) {
    return alphaSort(data, "username").map((item) => {
      return {
        label: item.username,
        value: item.id,
      };
    });
  }

  if (cacheKey === cacheKeys.holdStyles) {
    return alphaSort(data, "name").map((item) => {
      return {
        label: (
          <span>
            <HoldStyle name={item.name} icon={item.icon} small={true} />{" "}
            {item.name}{" "}
          </span>
        ),
        value: item.id,
      };
    });
  }

  if (cacheKey === cacheKeys.tags) {
    return alphaSort(data, "name").map((item) => {
      return {
        label: (
          <span>
            <Emoji>{item.emoji}</Emoji> {item.name}
          </span>
        ),
        value: item.id,
      };
    });
  }

  return alphaSort(data, "name").map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
};

export default useApiResourceSelectOptions;
