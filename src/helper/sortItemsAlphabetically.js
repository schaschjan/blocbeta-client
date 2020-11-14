const sortItemsAlphabetically = (items, property) => {
  return items.sort((a, b) => {
    return a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1;
  });
};

export { sortItemsAlphabetically };
