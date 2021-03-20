export const classNames = (...classes) => {
  return [...classes].filter((className) => className !== null).join(" ");
};

export function joinClassNames(...classes) {
  function flatMap(arr) {
    return arr.flatMap((item) => (Array.isArray(item) ? flatMap(item) : item));
  }
  return flatMap(classes)
    .filter(
      (item, index, self) => Boolean(item) && self.indexOf(item) === index
    )
    .join(" ");
}
