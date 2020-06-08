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

export const resolveBoulders = (
  boulders,
  ascents,
  grades,
  walls,
  holdStyles,
  setters
) => {
  if (!boulders) {
    return [];
  }

  // map ascent data to boulder array, resolve linked ids
  for (let boulder of boulders) {
    if (ascents) {
      const ascentData = ascents.find(
        (ascent) => ascent.boulderId === boulder.id
      );

      boulder.points = ascentData.points;
      boulder.ascents = ascentData.ascents;
      boulder.me = ascentData.me;
    }

    if (walls) {
      boulder.startWall = walls.find(
        (wall) => wall.id === boulder.startWall.id
      );

      if (boulder.endWall) {
        boulder.endWall = walls.find((wall) => wall.id === boulder.endWall.id);
      }
    }

    if (grades) {
      boulder.grade = grades.find((grade) => grade.id === boulder.grade.id);
    }

    if (holdStyles) {
      boulder.holdStyle = holdStyles.find(
        (holdStyle) => holdStyle.id === boulder.holdStyle.id
      );
    }

    if (setters) {
      boulder.setters = boulder.setters.map((boulderSetter) =>
        setters.find((setter) => boulderSetter.id === setter.id)
      );
    }
  }

  return boulders;
};
