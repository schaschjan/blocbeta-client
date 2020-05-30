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

export const getPercentage = (amount, total) => {
  let percentage = 0;

  if (amount > 0) {
    percentage = (amount / total) * 100;
  }

  if (percentage === 0) {
    return `${amount} (0%)`;
  }

  if (percentage < 1) {
    return `${amount} (<1%)`;
  }

  return `${amount} (${Math.floor(percentage)}%)`;
};