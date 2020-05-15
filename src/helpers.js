export const resolveMedia = (path) => {
  return `https://boulderdb.de/uploads/${path}`;
};

export const alphaSort = (items, property) => {
  return items.sort((a, b) => {
    return a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1;
  });
};

export const largeQuery = {
  minWidth: 1140,
};

export const mediumQuery = {
  minWidth: 601,
  maxWidth: 1139,
};

export const smallQuery = {
  maxWidth: 600,
};

export const getOptions = (
  items,
  labelProperty = "name",
  valueProperty = "id"
) => {
  return items
    .map((item) => {
      return getOption(item, labelProperty, valueProperty);
    })
    .sort((a, b) => (a.label > b.label ? 1 : -1));
};

export const getOption = (
  item,
  labelProperty = "name",
  valueProperty = "id"
) => {
  return {
    label: item[labelProperty],
    value: item[valueProperty],
  };
};
