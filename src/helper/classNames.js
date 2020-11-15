export const classNames = (...classes) => {
  return [...classes].filter((className) => className !== null).join(" ");
};
