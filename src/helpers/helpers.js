export const resolveMedia = (path) => {
  return `https://boulderdb.de/uploads/${path}`;
};

export const alphaSort = (items, property) => {
  return items.sort((a, b) => {
    return a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1;
  });
};
