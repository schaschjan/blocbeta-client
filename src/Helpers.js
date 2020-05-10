import Context from "./Context";

export const alphabeticalSort = (a, b) => {
  return a > b ? 1 : -1;
};

export const largeQuery = {
  minWidth: 1140,
};

export const mediumQuery = {
  minWidth: 601,
  maxWidth: 1139
};

export const smallQuery = {
  maxWidth: 600
};
